from typing import Type
from django.db import transaction
from django.db.models.base import ModelBase
from django.db.models.signals import post_save
from django.dispatch import receiver

from .emails import send_deactivation_email, send_warning_email
from .models import Report


@receiver(post_save, sender=Report)
def update_user_report_count_and_reputation(
    sender: Type[ModelBase], instance: Report, created: bool, **kwargs
) -> None:
    if created:
        with transaction.atomic():
            reported_user_profile = instance.reported_user.profile
            reported_user_profile.report_count += 1
            reported_user_profile.save()

            if reported_user_profile.report_count == 1:
                send_warning_email(
                    instance.reported_user, instance.title, instance.description
                )
            elif reported_user_profile.report_count >= 5:
                instance.reported_user.is_active = False
                instance.reported_user.save()
                send_deactivation_email(
                    instance.reported_user, instance.title, instance.description
                )
