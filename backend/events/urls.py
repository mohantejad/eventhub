from django.urls import include, path
from rest_framework.routers import DefaultRouter

from events.views import EventBookingViewSet, EventViewSet


router = DefaultRouter()
router.register('events', EventViewSet)
router.register('booking', EventBookingViewSet)

urlpatterns = [
    path('event/', include(router.urls)),
]