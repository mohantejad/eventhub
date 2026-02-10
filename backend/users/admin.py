from django import forms
from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

from .models import User

# Form for creating new users in the admin interface
class UserCreationForm(forms.ModelForm):
    password1 = forms.CharField(label="Password", widget=forms.PasswordInput)
    password2 = forms.CharField(
        label="Password confirmation", widget=forms.PasswordInput
    )

    class Meta:
        model = User
        fields = '__all__'

    def clean_password2(self):
        # Ensure the two password entries match
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        # Save the user with a hashed password
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user

# Form for updating users in the admin interface
class UserChangeForm(forms.ModelForm):
    password = ReadOnlyPasswordHashField()

    class Meta:
        model = User
        fields = '__all__'

# Custom admin class for the User model
class UserAdmin(BaseUserAdmin):
    form = UserChangeForm  # Form for editing users
    add_form = UserCreationForm  # Form for creating users

    list_display = ['email', 'first_name', 'last_name', 'is_active', 'is_staff']  # Fields to display in list view
    list_filter = ["is_superuser", 'is_staff']  # Filters in the right sidebar
    search_fields = ('email', 'first_name', 'last_name')  # Fields to search by
    ordering = ('email',)  # Default ordering

    # Fieldsets for displaying user details in the admin
    fieldsets = (
        (_("Personal Info"), {"fields": ("first_name", "last_name", "email", "profile_picture")}),
        (_("Permissions"), {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        (_("Important Dates"), {"fields": ("last_login", "date_joined")}),
    )

    # Fieldsets for the user creation form in the admin
    add_fieldsets = [
        (
            None,
            {
                "classes": ["wide"],
                "fields": ["email", "password1", "password2"],
            },
        ),
    ]

# Register the custom User model and admin class
admin.site.register(User, UserAdmin)
# Unregister the default Group model from the admin (optional)
admin.site.unregister(Group)