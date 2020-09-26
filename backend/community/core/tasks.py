import io
from celery import shared_task
from origuide.loader import solve_fold

from core.models import Guide

from django.core.files.storage import default_storage
from django.core.files import File


def path_to_name(path: str) -> str:
    return path.split('/')[-1]


@shared_task
def process_guide(guide_pk):
    guide = Guide.objects.get(pk=guide_pk)
    guide.status = Guide.ProcessingStatus.PROCESSING
    guide.save()

    file = guide.guide_file.path
    try:
        print(f"Processing {guide.pk} started.")
        solved = solve_fold(file)
        file_path = f"animations/{path_to_name(guide.guide_file.name)}"
        default_storage.save(file_path, io.StringIO(solved))
        guide.status = Guide.ProcessingStatus.DONE
        guide.animation_file = file_path
        print(f"Processing {guide.pk} finished.")
    except Exception as e:
        print(f"Processing of {guide.pk} failed.", e)
        guide.status = Guide.ProcessingStatus.ERROR
    finally:
        guide.save()