from darkflow.net.build import TFNet
import cv2
import os

import config



TFNet = TFNet({"model": config.YOLO_MODEL,
               "config": config.YOLO_CONFIG,
               "load": config.YOLO_LOAD,
               "threshold": 0,
               "gpu": 1.0})


class YOLO(object):
    def __init__(self):
        self.frame = None
        self.play = True

    def detect(self, frame):
        if frame is not None:
            result = TFNet.return_predict(frame)
            cars = []
            for item in result:
                tx = item['topleft']['x']
                ty = item['topleft']['y']
                bx = item['bottomright']['x']
                by = item['bottomright']['y']
                label = item['label']
                if label == "car" or label == "truck":
                    # roi_color = frame[ty:by, tx:bx]
                    cars.append({'tx': tx, 'ty': ty, 'bx': bx, 'by': by})
                cv2.rectangle(frame, (tx, ty), (bx, by), (255, 0, 0), 2)
                cv2.putText(frame, label, (tx + 10, ty), cv2.FONT_HERSHEY_PLAIN, 1, (255, 0, 0), 2)
            self.frame = frame
            return cars

    def status_image_no_run(self):
        path = os.path.join(config.BASE_DIR, "camera"),
        return self.status_image(path + "//no_run.png")

    def status_image(self, filename):
        image = cv2.imread(filename)
        image_encode = cv2.imencode('.jpg', image)[1].tostring()
        return image_encode

    def get_mjpeg(self):
        while self.play:
            if self.frame is not None:
                frame = cv2.imencode('.jpg', self.frame)[1].tostring()
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
            else:
                return self.status_image_no_run()
