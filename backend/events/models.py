from django.db import models

from users.models import User

class Event(models.Model):
    class City(models.TextChoices):
        SYDNEY = 'Sydney'
        MELBOURNE = 'Melbourne'
        BRISBANE = 'Brisbane'
        ADELAIDE = 'Adelaide'
        PERTH = 'Perth'
        HOBART = 'Hobart'
        DARWIN = 'Darwin'
        CANBERRA = 'Canberra'
    
    class Category(models.TextChoices):
        MUSIC = "Music"
        NIGHTLIFE = "Nightlife"
        ARTS = "Performing & Visual Arts"
        HOLIDAYS = "Holidays"
        DATING = "Dating"
        HOBBIES = "Hobbies"
        BUSINESS = "Business"
        FOOD_DRINK = "Food & Drink"

    class Mode(models.TextChoices):
        ONLINE = "Online"
        ONSITE = "Onsite"
        HYBRID = "Hybrid"

    title = models.CharField(max_length=200)
    description = models.TextField()
    city = models.CharField(
        max_length=255,
        choices=City.choices,
    )
    event_category = models.CharField(max_length=255, choices=Category.choices)
    event_mode = models.CharField(max_length=100, choices=Mode.choices)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    date = models.DateTimeField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='event_images/', null=True, blank=True)
    number_of_bookings = models.PositiveIntegerField(default=0)
    liked_by = models.ManyToManyField(User, related_name="liked_events", blank=True)

    def __str__(self):
        return self.title
    

class EventBooking(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    quantity = models.PositiveIntegerField()
    booked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.email} - {self.event.title} ({self.quantity})"


