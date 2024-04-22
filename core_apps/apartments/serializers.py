from rest_framework import serializers
from .models import Apartment


class ApartmentSerializer(serializers.ModelSerializer):
    tenant = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Apartment
        exclude = ["pkid", "updated_at"]
