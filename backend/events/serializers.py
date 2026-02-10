from rest_framework import serializers
from .models import Event, EventBooking

class EventSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.first_name')
    likes = serializers.SerializerMethodField()
    liked = serializers.SerializerMethodField()

    def get_likes(self, obj):
        return obj.liked_by.count()

    # def get_liked(self, obj):
    #     user = self.context.get('request').user
    #     if user and user.is_authenticated:
    #         return obj.liked_by.filter(id=user.id).exists()
    #     return False
    def get_liked(self, obj):
        user = self.context.get('request').user
        print(f"[DEBUG] User: {user}, Authenticated: {user.is_authenticated}")
        if user and user.is_authenticated:
            exists = obj.liked_by.filter(id=user.id).exists()
            print(f"[DEBUG] User liked event: {exists}")
            return exists
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
