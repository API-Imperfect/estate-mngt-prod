from uuid import UUID
from celery import shared_task
from .models import Profile
import cloudinary.uploader


@shared_task(name="upload_avatar_to_cloudinary")
def upload_avatar_to_cloudinary(profile_id: UUID, image_content: bytes) -> None:
    profile = Profile.objects.get(id=profile_id)
    response = cloudinary.uploader.upload(image_content)
    profile.avatar = response["url"]
    profile.save()


@shared_task(name="update_all_reputations")
def update_all_reputations():
    for profile in Profile.objects.all():
        profile.update_reputation()
        profile.save()
