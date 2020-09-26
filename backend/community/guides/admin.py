from django.contrib import admin

from guides.models import Guide


@admin.register(Guide)
class GuideAdmin(admin.ModelAdmin):
    pass
