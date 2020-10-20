import io

from celery import shared_task
from celery.exceptions import SoftTimeLimitExceeded
from django.core.files.storage import default_storage
from origuide.processor import solve_fold
from os import path

from guides.models import Guide


@shared_task(ignore_result=True, time_limit=180 * 60, soft_time_limit=120 * 60)
def process_guide(guide_pk):
    guide = Guide.objects.get(pk=guide_pk)
    guide.status = Guide.ProcessingStatus.PROCESSING
    guide.save()

    file = guide.guide_file.path
    try:
        print(f"Processing {guide.pk} started.")
        solved = solve_fold(file)
        file_path = f"animations/{path.basename(guide.guide_file.name)}"
        default_storage.save(file_path, io.StringIO(solved))
        guide.status = Guide.ProcessingStatus.DONE
        guide.animation_file = file_path
        print(f"Processing {guide.pk} finished.")
    except SoftTimeLimitExceeded:
        print(f"Time limit exceeded for processing {guide.pk}")
        guide.status = Guide.ProcessingStatus.TIMEOUT
    except Exception as e:
        print(f"Processing of {guide.pk} failed.", e)
        guide.status = Guide.ProcessingStatus.ERROR
    finally:
        guide.save()
