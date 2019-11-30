from camera.camera import Camera
from fuzzy_control.fuzzy import FuzzyControlCamera
from threading import Thread
import time
import config

if config.YOLO_ENABLED is True:
    from vision.yolo import YOLO
    from vision.registrator import FlatNumberRegistrator


class Intelligence(object):
    def __init__(self):
        self.yolo_enabled = False
        # CAMERA
        self.camera = Camera()
        # FUZZY
        self.fuzzy_control = FuzzyControlCamera()
        self.fuzzy_thread = None
        self.fuzzy = None
        if config.YOLO_ENABLED is True:
            self.yolo = YOLO()
            self.flat_registrator = FlatNumberRegistrator()
            self.vision_thread = Thread(target=self.vision_loop, daemon=True)
            self.vision_thread.start()
        self.start()

    def start(self):
        self.camera.start()
        self.fuzzy_thread = Thread(target=self.fuzzy_loop, daemon=True)
        self.fuzzy_thread.start()

    def stop(self):
        print("shutdown all process")
        self.camera.stop()

    def fuzzy_loop(self):
        while 1:
            frame = self.camera.get_frame()
            if frame is not None:
                self.fuzzy = self.fuzzy_control.compute(frame)
                time.sleep(10)

    def vision_loop(self):
        while 1:
            frame = self.camera.get_frame()
            if frame is not None:
                cars = self.yolo.detect(frame)
                self.flat_registrator.search_and_register(cars=cars,frame=frame)


    def get_mjpeg(self):
        if self.get_camera_status():
            if config.YOLO_ENABLED:
                return self.yolo.get_mjpeg()
            else:
                return self.camera.get_mjpeg()
        else:
            return self.camera.status_image_no_run()


    def get_camera_status(self):
        return self.camera.status


    def get_camera_mjpeg(self):
        return self.camera.get_mjpeg()


    def get_yolo_mjpeg(self):
        return self.yolo.get_mjpeg()

    def get_fuzzy(self):
        return self.fuzzy
