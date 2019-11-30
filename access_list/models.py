from django.db import models
import datetime


class AccessList(models.Model):
    id = models.AutoField(primary_key=True)
    number = models.CharField(max_length=255, blank=False, unique=True)
    mark = models.CharField(max_length=255, blank=False)
    ownerName = models.CharField(max_length=255, blank=False)
    created = models.DateTimeField(max_length=255, blank=False, auto_now_add=True)
    detected = models.DateTimeField(null=True, blank=True)

    def get_by_id(self, id):
        return AccessList.objects.filter(id=id).first()

    def delete_by_id(self, id):
        item = AccessList.objects.filter(id=id).first()
        try:
            if item is None:
                return False
            else:
                item.delete()
                return True
        except:
            return False

    @staticmethod
    def register_flat_number(number):
        access_number = AccessList.objects.filter(number=number).first()
        if access_number is not None:
            access_number.detected = datetime.datetime.now(tz=datetime.timezone.utc)
            access_number.save()
            return True
        return False
