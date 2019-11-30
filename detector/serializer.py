from rest_framework import serializers
from detector.models import Detector


class DetectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Detector
        fields = ("id", "detected", "number", "photoFileName", "allow")
        read_only_fields = ('id', 'detected', 'photoFileName', 'allow')