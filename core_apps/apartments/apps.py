from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class ApartmentsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "core_apps.apartments"
    verbose_name = _("Apartments")
