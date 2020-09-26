from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from django.db.models import CASCADE


class Guide(models.Model):
    class ProcessingStatus(models.TextChoices):
        QUEUED = 'QUE', 'Queued'
        PROCESSING = 'PRO', 'Processing'
        TIMEOUT = 'TMO', 'Timeout'
        ERROR = 'ERR', 'Error'
        DONE = 'DON', 'Done'

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=CASCADE)
    name = models.CharField(max_length=256)
    published_at = models.DateTimeField(auto_now_add=True)
    steps = models.IntegerField(default=0)
    guide_file = models.FileField(upload_to='guides/')
    animation_file = models.FileField(upload_to='animations/')
    status = models.CharField(max_length=32, choices=ProcessingStatus.choices, default=ProcessingStatus.QUEUED)
    private = models.BooleanField(default=True)
