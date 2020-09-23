"""community URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import routers
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView

from accounts.urls import router as accounts_router
from core.urls import router as core_router

api_router = routers.DefaultRouter()
api_router.registry.extend(accounts_router.registry)
api_router.registry.extend(core_router.registry)

urlpatterns = [
                  path('admin/', admin.site.urls),
                  path('api/', include(api_router.urls)),
                  path('api/token/', TokenObtainPairView.as_view(), name='token-obtain-pair'),
                  path('api/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
              ] + static('uploads/', document_root=settings.MEDIA_ROOT)
