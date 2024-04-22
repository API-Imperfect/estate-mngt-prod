from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from core_apps.common.models import TimeStampedModel

User = get_user_model()


class Apartment(TimeStampedModel):
    unit_number = models.CharField(
        max_length=10, unique=True, verbose_name=_("Unit Number")
    )
    building = models.CharField(max_length=50, verbose_name=_("Building"))
    floor = models.PositiveIntegerField(verbose_name=_("Floor"))
    tenant = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="apartment",
        verbose_name=_("Tenant"),
    )

    def __str__(self) -> str:
        return f"Unit: {self.unit_number} -  Building: {self.building} - Floor: {self.floor}"
