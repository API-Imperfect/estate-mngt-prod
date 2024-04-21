import cloudinary.uploader

from core_apps.profiles.models import Profile


def save_profile(backend, user, response, *args, **kwargs):
    if backend.name == "google-oauth2":
        avatar_url = response.get("picture", None)
        if avatar_url:
            upload_result = cloudinary.uploader.upload(avatar_url)
            profile, created = Profile.objects.get_or_create(user=user)
            profile.avatar = upload_result["public_id"]
            profile.save()
