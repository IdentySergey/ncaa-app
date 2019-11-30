import cv2, os
import threading

import access_system.settings as settings
import camera.vlc_server

import config
import time


class Camera(object):
    def __init__(self):
        self.thread = None
        self.camera = None
        self.status = True
        self.frame = None
        self.play = True
        self.vlc_player = None

    def __loop__(self):
        self.camera = cv2.VideoCapture(config.VIDEO_CAPTURE)
        while self.play:
            ret, frame = self.camera.read()
            if frame is not None:
                self.status = True
                self.frame = frame
            else:
                self.camera = cv2.VideoCapture(config.VIDEO_CAPTURE)
                self.status = False

    def status_image_no_run(self):

        image = cv2.imread(settings.BASE_DIR + "\\camera\\no_run.png")
        image_encode = cv2.imencode('.jpg', image)[1].tostring()
        return image_encode

    def start(self):
        print("... start camera ... ")
        if self.thread is None:
            self.thread = threading.Thread(target=self.__loop__)
            self.play = True
            self.thread.start()

    def stop(self):
        print("... stop camera ... ")
        if self.thread is not None:
            self.play = False
            self.thread.join()
            self.thread = None


    def get_frame(self):
        return self.frame

    def get_mjpeg(self):
        while self.play:
            if self.frame is not None:
                frame = cv2.imencode('.jpg', self.frame)[1].tostring()
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
            else:
                return (b'--frame\r\n'
                 b'Content-Type: image/jpeg\r\n\r\n' + self.status_image_no_run() + b'\r\n')

    def status(self):
        return self.status