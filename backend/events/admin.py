from django.contrib import admin
from .models import Event

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'city', 'date', 'created_by')
    search_fields = ('title', 'city')
    list_filter = ('date', 'city')
