from django.db import models
import datetime
import os
from access_system.settings import BASE_DIR
from access_list.models import AccessList

BASE_DETECTED = os.path.join(BASE_DIR, "detected")


def delete_file(filename):
    os.remove(os.path.join(os.path.join(BASE_DETECTED, filename)))


class Detector(models.Model):
    id = models.AutoField(primary_key=True)
    detected = models.DateTimeField(auto_now=True)
    number = models.CharField(max_length=255)
    photoFileName = models.CharField(max_length=255, blank=False)
    allow = models.BooleanField(default=False)


    # def waiter_create_record(self, number):
    #     wait_minuts = 1
    #     last_detected = Detector.objects.all().order_by("-detected").first()
    #     if last_detected is not None:
    #         last_detected = last_detected.detected + datetime.timedelta(minutes=wait_minuts)
    #         current = datetime.datetime.now(tz=datetime.timezone.utc)
    #         if current > last_detected:
    #             return True
    #         else:
    #             return False
    #     else:
    #         return True
    #
    # def create(self, number, photo_file_name):
    #     access_list = AccessList()
    #     if self.waiter_create_record(number):
    #         item = Detector()
    #         item.number = number.upper()
    #         item.allow = access_list.register_flat_number(number)
    #         item.photoFileName = photo_file_name
    #         item.save()
    #         return True
    #     else:
    #         return False

    def get_by_id(self, id):
        return Detector.objects.filter(id=id).first()

    def delete_by_id(self, id):
        item = Detector.objects.filter(id=id).first()
        if item is not None:
            delete_file(item.photoFileName)
            item.delete()
            return True
        else:
            return False