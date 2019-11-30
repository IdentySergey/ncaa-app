from keras.applications.mobilenet import MobileNet, preprocess_input
from keras.layers import Dropout, Flatten, Dense
from keras.models import Model
from keras.regularizers import l2
from keras.layers import Input
from keras.preprocessing.image import img_to_array, ImageDataGenerator
import numpy as np
import time
import vision.preproccessing as preproccessing
import cv2
import config



class AutomaticNumberRecognation(object):
    map_char = {
        0: '0', 1: '1', 2: 'A', 3: 'B', 4: 'C', 5: 'E', 6: 'H', 7: 'K', 8: 'M', 9: 'P', 10: 'T', 11: '2', 12: 'X',
        13: 'Y', 14: '', 15: '3', 16: '4', 17: '5', 18: '6', 19: '7', 20: '8', 21: '9',
    }

    map_number = [0, 1, 3, 11, 15, 16, 17, 18, 19, 20, 21]

    map_symbols = [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 20]

    replace_symbol_to_number = {
        "B": "8",
        "O": "0"
    }

    replace_number_to_symbol = {
        "8": "B",
        "0": "O"
    }

    regions = [
        "01","02","102","03","04","05", "06","07","08","09","10","11",
        "12","13","113","14","15","16","116","716","17","18","19","21",
        "121","22","23","93","123","24","84","88","124","25","125","26",
        "126","27","28","29","30","31","32","33","34","134","35","36",
        "136","37","38","85","138","39","91","40", "41","42",
        "142","43","44","45","46","47","48","49","50","90",
        "150","190","750","51","52","152","53","54","154",
        "55", "56","57","58","59","81","159","60","61","161",
        "62","63","163","64","164","65","66","96","196","67",
        "68","69","70","71","72","73","173","74","174", "75",
        "80","76","77","97","99","177","197","199","777","799","78",
        "98","178","79","82","83","86","87","89","92","94","95",
    ]

    def __init__(self):
        self.build_model()
        self.model.load_weights(config.FLAT_NUMBER_WEIGHT)
        self.preprocessing_flat_number = preproccessing.PreprocessingFlatNumber(self.model)
        self.preload()
        self.detectFlatNumber = cv2.CascadeClassifier(config.HARRCASCADE_RUSSIAN_PLATE_NUMBER)

    def build_model(self):

        base_model = MobileNet(include_top=False, weights=None, input_tensor=Input(shape=(50, 50, 3)))
        x = base_model.output
        x = Dense(128, activation='relu')(x)
        x = Dense(128, activation='relu')(x)
        x = Dropout(.4)(x)
        x = Flatten()(x)
        predictions = Dense(22, init='glorot_uniform', W_regularizer=l2(.0005), activation='softmax')(x)
        model = Model(input=base_model.input, output=predictions)
        model.compile(optimizer="rmsprop", loss='categorical_crossentropy', metrics=['accuracy'])
        self.model = model
        return model


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
                recognize.append(14)
            else:
                recognize.append(value)
            position += 1
        position = 0
        return recognize


    def number_position(self, value):
        if value in self.map_number:
            return True
        return False

    def char_position(self, value):
        if value in self.map_symbols:
            return True
        return False

    def remove_values_from_list(self, the_list, val):
        return [value for value in the_list if value != val]


    def region_validation(self,answers):
        region = ""
        for item in answers:
            region += str(self.map_char[item])
        if region in self.regions:
            return True
        return False

    def preload(self):
        preload_image = cv2.imread(config.INIT_IMAGE)
        preload_image = self.preprocessing_flat_number.standardize(preload_image)
        preload_image = cv2.resize(preload_image, (50, 50))
        answers = self.predict([preload_image])


    def validation(self, answers):
        answers = self.remove_values_from_list(answers, 14)
        if len(answers) > 9 or len(answers) <= 6:
            return False
        position = 0
        for char in answers:
            if position is 0:  # CHAR
                if self.char_position(char) is False: return False
            if position >= 1 and position <= 3:  # SYMBOLS
                if self.number_position(char) is False: return False
            if position >= 4 and position <= 5:  # CHAR
                if self.char_position(char) is False: return False
            if position >= 6 and position <= 8:  # SYMBOLS
                if self.number_position(char) is False: return False
            position += 1

        if self.region_validation(answers=answers[6:]) is False:
            return False

        return True

    def number_to_symbols_replace(self, value):
        if value in self.replace_number_to_symbol:
            return self.replace_number_to_symbol[value]
        return value

    def symbols_to_numer_replace(self, value):
        if value in self.replace_symbol_to_number:
            return self.replace_symbol_to_number[value]
        return value

    def replace_symbols(self, number):
        position = 0
        replaced_number = ""
        for char in number:
            if position is 0:  # SYMBOLS
                replaced_number += self.number_to_symbols_replace(char)
            if position >= 1 and position <= 3:  # NUMBER
                replaced_number += self.symbols_to_numer_replace(char)
            if position >= 4 and position <= 5:  # SYMBOL
                replaced_number += self.number_to_symbols_replace(char)
            if position >= 6 and position <= 8:  # NUMBER
                replaced_number += self.symbols_to_numer_replace(char)
            position += 1
        return replaced_number

    def get(self, frame, car):
        roi_color = frame[car['ty']:car['by'], car['tx']:car['bx']]
        # roi_color = car
        bgr = cv2.cvtColor(roi_color, cv2.COLOR_BGR2RGB)
        gray = cv2.cvtColor(roi_color, cv2.COLOR_BGR2GRAY)

        flats = self.detectFlatNumber.detectMultiScale(gray, 1.2, 1)

        # cv2.rectangle(frame, (tx, ty), (tx+ew, ty+eh), (0, 255, 0), 2)
        # cv2.imshow("number detection", roi_color)
        # cv2.waitKey(0)
        # cv2.destroyAllWindows()

        recognitions = []
        for (ex, ey, ew, eh) in flats:
            if ew > 100 and eh > 25:
                tx = car['tx'] + ex
                ty = car['ty'] + ey
                if ty > 495:
                    # print("DETECTED")
                    # start_time = time.time()
                    number = bgr[ey:ey + eh, ex:ex + ew]
                    number = self.preprocessing_flat_number.standardize(number)
                    letters = self.preprocessing_flat_number.find_letters(number)
                    if len(letters) > 0:
                        answers = self.predict(letters)
                        recognation = ""
                        for item in answers:
                            recognation += str(self.map_char[item])
                        print(recognation)
                        if self.validation(answers) is True:
                            recognation = self.replace_symbols(recognation)
                            recognitions.append(recognation)
        return recognitions
