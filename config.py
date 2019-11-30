import os

# BASE DIR

BASE_DIR = "E:\\Develop\\access-system"

# HARDWARE

DEVICE_API = "http://10.96.96.30:8000/rpi_django/"

DEVICE_IP = "10.96.96.30"

# CAMERA

VIDEO_CAPTURE = "http://192.168.77.151:8080/camera.flv"  # VLC OR VIDEO

# VIDEO_CAPTURE = BASE_DIR + "\\vision\\TEST.avi"


# YOLO

YOLO_ENABLED = True

YOLO_MODEL = BASE_DIR + "\\vision\\yolo.cfg"

YOLO_CONFIG = BASE_DIR + "\\vision\\cfg\\"

YOLO_LOAD = BASE_DIR + "\\vision\\yolo.weights"

# RECOGNATION

INIT_IMAGE = BASE_DIR + "\\vision\\init.jpg"  # Fix bugs in django

HARRCASCADE_RUSSIAN_PLATE_NUMBER = BASE_DIR + "\\vision\\haarcascade_russian_plate_number.xml"

FLAT_NUMBER_WEIGHT = BASE_DIR + "\\vision\\mobileNet_v1_flat_number_recognation.h5"

SAVE_PATH_FRAME = BASE_DIR + "\\static\\detected\\"