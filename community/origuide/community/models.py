from django.db import models
from django.conf import settings
from django.db.models import CASCADE


class Guide(models.Model):
    uploader = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=CASCADE)
    name = models.CharField(max_length=256)
    published_at = models.DateTimeField()
    author = models.CharField(max_length=256)
    steps = models.IntegerField(default=0)
    processed = models.BooleanField(default=False)
