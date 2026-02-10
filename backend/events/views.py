from django.db.models import Q
import django_filters
from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission
from datetime import date, datetime, timedelta

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
    event_mode = django_filters.CharFilter(field_name="event_mode", lookup_expr="iexact")
    date = django_filters.CharFilter(method="filter_by_date")

    class Meta:
        model = Event
        fields = ["city", "event_category", "event_mode"]

    def filter_by_keyword(self, queryset, name, value):
        return queryset.filter(
            Q(title__icontains=value) | Q(description__icontains=value)
        )

    def filter_by_date(self, queryset, name, value):
        today = date.today()
        normalized = value.lower()

        if normalized == "today":
            return queryset.filter(date__date=today)
        elif normalized == "tomorrow":
            return queryset.filter(date__date=today + timedelta(days=1))
        elif normalized == "this_weekend":
            return queryset.filter(date__week_day__in=[1, 7])

        # Also support ISO date query values from the frontend (YYYY-MM-DD)
        try:
            parsed_date = datetime.strptime(value, "%Y-%m-%d").date()
            return queryset.filter(date__date=parsed_date)
        except ValueError:
            pass

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
    permission_classes = [AllowAny]
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            booking = serializer.save()
            event = booking.event
            event.number_of_bookings += int(booking.quantity)
            event.save()
            total_price = booking.quantity * booking.event.price

            if settings.SEND_BOOKING_EMAILS:
                send_mail(
                    subject="🎟️ Ticket Confirmation - Your Event Booking",
                    message=(
                        f"Thank you {booking.name} for booking {booking.quantity} ticket(s) to our event!\n\n"
                        f"Event ID: {booking.event_id}\n"
                        f"Quantity: {booking.quantity}\n"
                        f"Total: ${total_price}\n\n"
                        "We look forward to seeing you there!"
                    ),
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[booking.email],
                )

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
