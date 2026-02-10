from django.db.models import Q
import django_filters
from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission

from django.core.mail import send_mail
from .models import Event, EventBooking
from .serializers import EventBookingSerializer, EventSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from main import settings


class IsEventCreator(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.created_by == request.user


class EventFilter(django_filters.FilterSet):
    city = django_filters.CharFilter(field_name="city", lookup_expr="iexact")
    search = django_filters.CharFilter(method="filter_by_keyword")
    event_category = django_filters.CharFilter(
        field_name="event_category", lookup_expr="iexact")
    date = django_filters.CharFilter(method="filter_by_date")

    class Meta:
        model = Event
        fields = ["city", "event_category"]

    def filter_by_keyword(self, queryset, name, value):
        return queryset.filter(
            Q(title__icontains=value) | Q(description__icontains=value)
        )

    def filter_by_date(self, queryset, name, value):
        from datetime import date, timedelta

        today = date.today()
        if value.lower() == "today":
            return queryset.filter(date=today)
        elif value.lower() == "tomorrow":
            return queryset.filter(date=today + timedelta(days=1))
        elif value.lower() == "this_weekend":
            return queryset.filter(date__week_day__in=[6, 7])
        return queryset


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    filter_backends = (filters.OrderingFilter,
                       django_filters.rest_framework.DjangoFilterBackend)
    filterset_class = EventFilter
    search_fields = ["city", "title", "description"]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def my_events(self, request):
        user = request.user
        events = Event.objects.filter(created_by=user)
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        elif self.action == "create":
            return [IsAuthenticated()]
        elif self.action in ["update", "partial_update", "destroy"]:
            return [IsAuthenticated(), IsEventCreator()]
        return super().get_permissions()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def like(self, request, pk=None):
        event = self.get_object()
        user = request.user
        if user in event.liked_by.all():
            event.liked_by.remove(user)
            liked = False
        else:
            event.liked_by.add(user)
            liked = True
        return Response({
            'liked': liked,
            'likes': event.liked_by.count()
        })


class EventBookingViewSet(viewsets.ModelViewSet):
    queryset = EventBooking.objects.all()
    serializer_class = EventBookingSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():

            booking = serializer.save()
            event = booking.event
            event.number_of_bookings += int(booking.quantity)
            event.save()

            send_mail(
                subject="🎟️ Ticket Confirmation - Your Event Booking",
                message=f'Thank you {serializer.data['name']} for booking {serializer.data['quantity']} ticket(s) to our event!\n\n'
                f'Event ID: {serializer.data['event']}\n'
                f'Quantity: {serializer.data['quantity']}\n'
                f'Total: $ {int(serializer.data['quantity']) * int(event.price)}\n\n'
                f'We look forward to seeing you there!',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[serializer.data['email']],
            )

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
