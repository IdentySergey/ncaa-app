import vision.anpr
from detector.models import Detector
import datetime
import cv2
import uuid
from access_list.models import AccessList
import config


class FlatNumberRegistratorBufferValidation():
    def __init__(self):
        self.buffer = []

    def get(self, number):
        for i in range(0, len(self.buffer), 1):
            if self.buffer[i]['number'] == number:
                return i
        return -1


    def remove_staff(self,number):
        for item in self.buffer:
            item['error'] = item['error'] + 1
        self.buffer = [x for x in self.buffer if x['error'] < 10]


    def validation(self, number):
        item_identy = self.get(number)
        if item_identy > -1:
            if self.buffer[item_identy]['detected'] > 3:
                self.buffer.remove(self.buffer[item_identy])
                self.remove_staff(number)
                return True
            else:
                self.add(number)
                self.remove_staff(number)
                return False
        else:
            self.add(number)
            self.remove_staff(number)
            return False


    def add(self, number):
        item_identy = self.get(number)
        if item_identy > -1:
            self.buffer[item_identy] = {
                'number': number,
                'detected': self.buffer[item_identy]['detected'] + 1,
                'error': 0
            }
        else:
            self.buffer.append({
                'number': number,
                'detected': 1,
                'error': 0
            })


class FlatNumberRegistrator(object):
    def __init__(self):
        self.anpr = vision.anpr.AutomaticNumberRecognation()
        self.bufferValidation = FlatNumberRegistratorBufferValidation()
        self.time_wait_registration = 2

    def search_and_register(self, cars, frame):
        if len(cars) < 1:
            return
        detections = []
        for item in cars:
            detected = self.anpr.get(frame, item)
            if len(detected) > 0:
                detections.append(detected)
        if len(detections) > 0:
            for item in detections:
                if self.validation(item[0]) is True:
                    self.registration(frame, item[0])

    def last_detection(self):
        last_detection = Detector.objects.all().order_by("-detected").first()
        return last_detection

    def last_detection_number(self, number):
        last_detection = Detector.objects.filter(number=number).order_by("-detected").first()
        return last_detection

    def save_frame(self, frame):
        save_path = config.SAVE_PATH_FRAME
        hex = uuid.uuid4().hex
        cv2.imwrite(save_path + str(hex) + ".jpg", frame)
        return str(hex) + ".jpg"

    def registration(self, frame, number):
        filename = self.save_frame(frame)
        item = Detector()
        item.number = number.upper()
        item.allow = AccessList.register_flat_number(number)
        item.photoFileName = filename
        item.save()
        return True

    def validation(self, number):
        current = datetime.datetime.now(tz=datetime.timezone.utc)
        last_detection_number = self.last_detection_number(number)
        if self.bufferValidation.validation(number) is False:
            return False
        if last_detection_number is None:
            return True
        last_detection_number = last_detection_number.detected + datetime.timedelta(minutes=self.time_wait_registration)
        if current < last_detection_number:
            return False
        return True
