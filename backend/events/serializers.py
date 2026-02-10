from rest_framework import serializers
from .models import Event, EventBooking

class EventSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.first_name')
    likes = serializers.SerializerMethodField()
    liked = serializers.SerializerMethodField()

    def get_likes(self, obj):
        return obj.liked_by.count()

    def get_liked(self, obj):
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        if user and user.is_authenticated:
            return obj.liked_by.filter(id=user.id).exists()
        return False

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'city', 'date', 'created_by',
            'event_mode', 'image', 'event_category', 'price',
            'number_of_bookings', 'likes', 'liked'
        ]

class EventBookingSerializer(serializers.ModelSerializer):
    event = serializers.PrimaryKeyRelatedField(queryset=Event.objects.all())
    class Meta:
        model = EventBooking
        fields = "__all__"
