import os
from django.apps import apps
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import PermissionsMixin
from django.core.files.storage import FileSystemStorage
from main import settings

# Custom user manager to handle user creation logic
class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user_object(self, email, password, **extra_fields):
        # Internal method to create a user object with a hashed password
        if not email:
            raise ValueError("The given email must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.password = make_password(password)
        return user

    def _create_user(self, email, password, **extra_fields):
        """
        Create and save a user with the given email and password.
        """
        user = self._create_user_object(email, password, **extra_fields)
        user.save(using=self._db)
        return user

    async def _acreate_user(self, email, password, **extra_fields):
        """Async version of _create_user()."""
        user = self._create_user_object(email, password, **extra_fields)
        await user.asave(using=self._db)
        return user

    def create_user(self, email=None, password=None, **extra_fields):
        # Create a regular user (not staff or superuser)
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    create_user.alters_data = True

    async def acreate_user(self, email=None, password=None, **extra_fields):
        # Async version of create_user
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return await self._acreate_user(email, password, **extra_fields)

    acreate_user.alters_data = True

    def create_superuser(self, email=None, password=None, **extra_fields):
        # Create a superuser with staff and superuser privileges
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self._create_user(email, password, **extra_fields)

    create_superuser.alters_data = True

# File storage for profile pictures
pp_fs = FileSystemStorage(location=os.path.join(settings.MEDIA_ROOT, "profile_pictures"))

# Abstract user model with custom fields
class CustomAbstractUser(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(_("first name"), max_length=150, blank=True)
    last_name = models.CharField(_("last name"), max_length=150, blank=True)
    email = models.EmailField(
        _("email address"), 
        blank=False, 
        null=False,
        unique=True,
        error_messages={
            "unique": _("A user with that email already exists."),
        },
    )
    profile_picture = models.ImageField(
        _('profile_image'),
        storage=pp_fs,
        blank=True,
        null=True
    )
    is_staff = models.BooleanField(
        _("staff status"),
        default=False,
        help_text=_("Designates whether the user can log into this admin site."),
    )
    is_active = models.BooleanField(
        _("active"),
        default=True,
        help_text=_(
            "Designates whether this user should be treated as active. "
            "Unselect this instead of deleting accounts."
        ),
    )
    date_joined = models.DateTimeField(_("date joined"), default=timezone.now)

    # Attach the custom manager
    objects = UserManager()

    # Fields used for authentication
    EMAIL_FIELD = "email"
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    class Meta:
        verbose_name = _("user")
        verbose_name_plural = _("users")
        abstract = True  # This model is abstract and not created in the DB

    def clean(self):
        # Normalize the email address
        super().clean()
        self.email = self.__class__.objects.normalize_email(self.email)

    def get_full_name(self):
        """
        Return the first_name plus the last_name, with a space in between.
        """
        full_name = "%s %s" % (self.first_name, self.last_name)
        return full_name.strip()

    def get_short_name(self):
        """Return the short name for the user."""
        return self.first_name

    def email_user(self, subject, message, from_email=None, **kwargs):
        """Send an email to this user."""
        send_mail(subject, message, from_email, [self.email], **kwargs)

# Concrete user model that can be swapped in Django settings
class User(CustomAbstractUser):
    """
    Users within the Django authentication system are represented by this
    model.

    Username and password are required. Other fields are optional.
    """

    class Meta(CustomAbstractUser.Meta):
        swappable = "AUTH_USER_MODEL"  # Allows swapping the user model in settings