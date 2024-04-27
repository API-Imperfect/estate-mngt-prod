from rest_framework import serializers

from .models import Rating


class RatingSerializer(serializers.ModelSerializer):
    rated_user_username = serializers.CharField(write_only=True)

    class Meta:
        model = Rating
        fields = ["id", "rated_user_username", "rating", "comment"]
        read_only_fields = ["id"]

    def create(self, validated_data) -> Rating:
        validated_data.pop("rated_user_username")
        rating = Rating.objects.create(**validated_data)
        return rating
