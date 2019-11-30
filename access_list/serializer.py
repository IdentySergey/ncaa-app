from access_list.models import AccessList
from rest_framework import serializers,pagination


class AccessListSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccessList
        fields = ("id", "number", "mark", "ownerName", "created", "detected")
        read_only_fields = ('id', 'created', 'detected')


class AccessListSerializerItem(serializers.ModelSerializer):
    class Meta:
        model = AccessList
        fields = ("id", "number", "mark", "ownerName", "created", "detected")
        read_only_fields = ('id', 'created', 'detected')
