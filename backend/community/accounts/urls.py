from django.conf.urls import url
from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView

from . import views

router = routers.DefaultRouter()
router.register('users', views.UserViewSet, basename='user')

additional_urls = [
    url(r'^password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
    path('token/', TokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
]
