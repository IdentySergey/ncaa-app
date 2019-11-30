from keras.applications.mobilenet import MobileNet, preprocess_input
from keras.layers import Dropout, Flatten, Dense
from keras.models import Model
from keras.regularizers import l2
from keras.layers import Input
from keras.preprocessing.image import img_to_array, ImageDataGenerator
import numpy as np
import time

import cv2
import config

class SearchSymbols(object):

    def __init__(self, model):
        self.model = model


    #
    # def build_model(self):
    #     base_model = MobileNet(include_top=False, weights=None, input_tensor=Input(shape=(50, 50, 3)))
    #     x = base_model.output
    #     x = Dense(128, activation='relu')(x)
    #     x = Dense(128, activation='relu')(x)
    #     x = Dropout(.4)(x)
    #     x = Flatten()(x)
    #     predictions = Dense(22, init='glorot_uniform', W_regularizer=l2(.0005), activation='softmax')(x)
    #     model = Model(input=base_model.input, output=predictions)
    #     model.compile(optimizer="rmsprop", loss='categorical_crossentropy', metrics=['accuracy'])
    #     self.model = model
    #     return model

    def predict(self, images):
        if len(images) <= 0:
            return []

        std = ImageDataGenerator(rescale=1. / 255)
        image_for_predication = np.zeros((len(images), 50, 50, 3))
        iterator = 0
        for image in images:
            image = img_to_array(image)
            image = std.standardize(image)
            image_for_predication[iterator] = image
            iterator += 1

        answer = self.model.predict(image_for_predication)
        assessments = np.argsort(answer, axis=1)
        recognize = []
        position = 0
        for item in assessments:
            value = item[-1]
            if answer[position][value] < 0.998: #998
                recognize.append([14,answer[position][value]])
            else:
                recognize.append([value,answer[position][value],answer[position][14]])
            position += 1
        return recognize
