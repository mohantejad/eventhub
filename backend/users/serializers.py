from djoser.serializers import UserCreateSerializer as DjoserUserCreateSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers

# Get the custom user model
User = get_user_model()

# Serializer for user creation, extending Djoser's serializer
class UserCreateSerializer(DjoserUserCreateSerializer):
    class Meta(DjoserUserCreateSerializer.Meta):
        model = User
        fields = ('id', 'first_name', 'last_name', 'email')  # Only expose selected fields

# Serializer for general user representation
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'  # Expose all fields (consider restricting for security)

# Serializer for current authenticated user, with limited fields
class CurrentUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email', 'profile_picture')  # Only expose relevant fields