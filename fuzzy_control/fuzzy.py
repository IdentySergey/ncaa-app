import numpy as np
import skfuzzy as fuzz
from skfuzzy import control as ctrl
from .weather import data_output, data_fetch, data_organizer, url_builder
from .video import blobDetect, frame_hist
import cv2
import time
import threading
import datetime


def vid(frame):
    # cap = cv2.VideoCapture('vtest.avi')
    fgbg = cv2.createBackgroundSubtractorMOG2()
    # ret, frame = cap.read()
    fgmask = fgbg.apply(frame)
    n = blobDetect(frame, fgmask)
    m = frame_hist(frame)
    return n, m


class FuzzyControlCamera(object):
    rules = {}
    current = {}

    def __init__(self):
        self.setUp()

    def get(self):
        return self.current

    def compute(self, frame):
        weather, temp = data_output(data_organizer(data_fetch(url_builder(545736))))

        now = datetime.datetime.now()
        time = now.hour

        movement, light = vid(frame)
        # temp = -39
        # movement = 0.434

        noise = self.noise(weather, time, light)
        dn = self.dn(weather, time, light)
        lightning = self.lightning(weather, time, light)
        focus = self.focus(dn, movement, noise)
        cleaning = self.cleaning(dn, movement, noise)
        heating = self.heating(temp)

        self.current = {
            # output
            'noise': noise,
            'dn': dn,
            'lightning': lightning,
            'focus': focus,
            'cleaning': cleaning,
            'heating': heating,

            # input
            'weather': weather,
            'time': time,
            'light': light,
            'movement': movement,
            'temp': temp
        }

        return self.current

    def noise(self, weather, time, light):
        noise_ctrl = ctrl.ControlSystem([self.rules['1.1'], self.rules['1.2'], self.rules['1.3']])
        noising = ctrl.ControlSystemSimulation(noise_ctrl)
        noising.input['weather'] = weather
        noising.input['time'] = time
        noising.input['light'] = light
        noising.compute()
        # print(noising.output['noise'])
        return noising.output['noise']

    # Система управления режима дня и ночи

    def dn(self, weather, time, light):
        dn_ctrl = ctrl.ControlSystem([self.rules['2.1'], self.rules['2.2']])
        dning = ctrl.ControlSystemSimulation(dn_ctrl)
        dning.input['weather'] = weather
        dning.input['time'] = time
        dning.input['light'] = light
        dning.compute()
        # print(dning.output['dn'])
        return dning.output['dn']

    # Система управления подсветкой
    def lightning(self, weather, time, light):
        lightning_ctrl = ctrl.ControlSystem(
            [self.rules['3.1'], self.rules['3.2'], self.rules['3.3'], self.rules['3.4']])
        lightninging = ctrl.ControlSystemSimulation(lightning_ctrl)
        lightninging.input['weather'] = weather
        lightninging.input['time'] = time
        lightninging.input['light'] = light
        lightninging.compute()
        # print(lightninging.output['lightning'])
        return lightninging.output['lightning']

    # Система управления автофокусом
    def focus(self, dn, movement, noise):
        focus_ctrl = ctrl.ControlSystem([self.rules['4.1'], self.rules['4.2']])
        focusing = ctrl.ControlSystemSimulation(focus_ctrl)
        focusing.input['dn2'] = dn
        focusing.input['movement'] = movement
        focusing.input['noise2'] = noise
        focusing.compute()
        # print(focusing.output['focus'])
        return focusing.output['focus']

    def cleaning(self, dn, movement, noise):
        cleaning_ctrl = ctrl.ControlSystem([self.rules['5.1'], self.rules['5.2']])
        cleaninging = ctrl.ControlSystemSimulation(cleaning_ctrl)
        cleaninging.input['dn2'] = dn
        cleaninging.input['movement'] = movement
        cleaninging.input['noise2'] = noise
        cleaninging.compute()
        # print(cleaninging.output['cleaning'])
        return cleaninging.output['cleaning']

    def heating(self, temp):
        heating_ctrl = ctrl.ControlSystem([self.rules['6.1'], self.rules['6.2'], self.rules['6.3'], self.rules['6.4']])
        heatinging = ctrl.ControlSystemSimulation(heating_ctrl)
        heatinging.input['temperature'] = temp
        heatinging.compute()
        # print(heatinging.output['heating'])
        return heatinging.output['heating']

    def setUp(self):
        weather = ctrl.Antecedent(np.arange(0, 13, 0.01), 'weather')
        time = ctrl.Antecedent(np.arange(0, 13, 0.01), 'time')
        light = ctrl.Antecedent(np.arange(0, 11, 0.01), 'light')
        movement = ctrl.Antecedent(np.arange(0, 1, 0.001), 'movement')
        temp = ctrl.Antecedent(np.arange(-40, 0, 1), 'temperature')
        noise = ctrl.Consequent(np.arange(0, 4, 0.01), 'noise')
        dn = ctrl.Consequent(np.arange(0, 2, 0.01), 'dn')
        lightning = ctrl.Consequent(np.arange(0, 5, 0.01), 'lightning')
        focus = ctrl.Consequent(np.arange(0, 2, 0.01), 'focus')
        cleaning = ctrl.Consequent(np.arange(0, 2, 0.01), 'cleaning')
        heating = ctrl.Consequent(np.arange(0, 7, 0.01), 'heating')

        weather['clean'] = fuzz.gaussmf(weather.universe, 2, 0.85)
        weather['cloudy'] = fuzz.gaussmf(weather.universe, 4, 0.85)
        weather['rain'] = fuzz.gaussmf(weather.universe, 6, 0.85)
        weather['hrain'] = fuzz.gaussmf(weather.universe, 8, 0.85)
        weather['snow'] = fuzz.gaussmf(weather.universe, 10, 0.85)
        weather['hsnow'] = fuzz.gaussmf(weather.universe, 12, 0.85)

        time['morning'] = fuzz.gaussmf(time.universe, 3, 1.26)
        time['day'] = fuzz.gaussmf(time.universe, 6, 1.26)
        time['evening'] = fuzz.gaussmf(time.universe, 9, 1.26)
        time['night'] = fuzz.gaussmf(time.universe, 12, 1.26)

        light['bright'] = fuzz.gaussmf(light.universe, -0.05119, 1.307)
        light['dusk'] = fuzz.gaussmf(light.universe, 4.87, 0.9428)
        light['dark'] = fuzz.gaussmf(light.universe, 10, 1.307)
        # light.view()
        movement['low'] = fuzz.gaussmf(movement.universe, 0.3352, 0.118)
        movement['high'] = fuzz.gaussmf(movement.universe, 0.612, 0.1118)

        temp['0'] = fuzz.gaussmf(temp.universe, 0, 5.664)
        temp['-10'] = fuzz.gaussmf(temp.universe, -10, 5.664)
        temp['-20'] = fuzz.gaussmf(temp.universe, -20, 5.664)
        temp['-40'] = fuzz.gaussmf(temp.universe, -40, 5.664)

        noise['low'] = fuzz.trimf(noise.universe, [-0.8, 0, 0.8])
        noise['medium'] = fuzz.trimf(noise.universe, [0.4, 1, 1.6])
        noise['high'] = fuzz.trimf(noise.universe, [1.2, 2, 2.8])

        dn['day'] = fuzz.trimf(dn.universe, [-0.6, 0, 0.6])
        dn['night'] = fuzz.trimf(dn.universe, [0.3, 1, 1.7])

        lightning['0'] = fuzz.trimf(lightning.universe, [-1, 0, 1])
        lightning['1'] = fuzz.trimf(lightning.universe, [0, 1, 2])
        lightning['2'] = fuzz.trimf(lightning.universe, [1, 2, 3])
        lightning['3'] = fuzz.trimf(lightning.universe, [2, 3, 3.2])

        focus['0'] = fuzz.trimf(focus.universe, [-1, 0, 0.5])
        focus['1'] = fuzz.trimf(focus.universe, [0.4, 1, 1])

        cleaning['0'] = fuzz.trimf(cleaning.universe, [-1, 0, 0.5])
        cleaning['1'] = fuzz.trimf(cleaning.universe, [0.4, 1, 1])

        heating['0'] = fuzz.trimf(heating.universe, [-1, 0, 1])
        heating['1'] = fuzz.trimf(heating.universe, [0, 1, 2])
        heating['2'] = fuzz.trimf(heating.universe, [1, 2, 3])
        heating['3'] = fuzz.trimf(heating.universe, [2, 3, 4])
        heating['4'] = fuzz.trimf(heating.universe, [3, 4, 5])

        # Правила зашумления
        rule1_1 = ctrl.Rule((weather['clean'] & time['evening'] & light['dusk']) |
                            (weather['clean'] & time['night'] & light['dark']) |
                            (weather['clean'] & time['night'] & light['dusk']) |
                            (weather['cloudy'] & time['morning'] & light['bright']) |
                            (weather['cloudy'] & time['morning'] & light['dusk']) |
                            (weather['cloudy'] & time['morning'] & light['dark']) |
                            (weather['cloudy'] & time['day']) |
                            (weather['cloudy'] & time['evening'] & light['dusk']) |
                            (weather['cloudy'] & time['evening'] & light['dark']) |
                            (weather['cloudy'] & time['night']),
                            noise['low'])

        self.rules.update({'1.1': rule1_1})

        rule1_2 = ctrl.Rule((weather['rain'] & time['morning'] & light['bright']) |
                            (weather['rain'] & time['morning'] & light['dark']) |
                            (weather['rain'] & time['day'] & light['bright']) |
                            (weather['rain'] & time['day'] & light['dark']) |
                            (weather['rain'] & time['evening'] & light['bright']) |
                            (weather['rain'] & time['evening'] & light['dark']) |
                            (weather['hrain'] & time['day'] & light['dark']) |
                            (weather['hrain'] & time['day'] & light['dark']) |
                            (weather['snow'] & time['morning'] & light['bright']) |
                            (weather['snow'] & time['morning'] & light['dark']) |
                            (weather['snow'] & time['day'] & light['bright']) |
                            (weather['snow'] & time['day'] & light['dark']) |
                            (weather['snow'] & time['evening'] & light['bright']),
                            noise['medium'])

        self.rules.update({'1.2': rule1_2})

        rule1_3 = ctrl.Rule((weather['rain'] & time['evening'] & light['dark']) |
                            (weather['rain'] & time['night'] & light['dark']) |
                            (weather['hrain'] & time['morning'] & light['dark']) |
                            (weather['hrain'] & time['morning'] & light['dark']) |
                            (weather['hrain'] & time['evening'] & light['dark']) |
                            (weather['hrain'] & time['evening'] & light['dark']) |
                            (weather['hrain'] & time['night'] & light['dark']) |
                            (weather['snow'] & time['evening'] & light['dark']) |
                            (weather['snow'] & time['evening'] & light['dark']) |
                            (weather['snow'] & time['night'] & light['dark']) |
                            (weather['hsnow']),
                            noise['high'])

        self.rules.update({'1.3': rule1_3})

        # Правила режима День/Ночь
        rule2_1 = ctrl.Rule((weather['cloudy'] & time['morning'] & light['bright']) |
                            (weather['cloudy'] & time['morning'] & light['dusk']) |
                            (weather['cloudy'] & time['day']) |
                            (weather['cloudy'] & time['evening'] & light['dusk']) |
                            (weather['rain'] & time['morning'] & light['bright']) |
                            (weather['rain'] & time['morning'] & light['dark']) |
                            (weather['rain'] & time['day'] & light['bright']) |
                            (weather['rain'] & time['day'] & light['dark']) |
                            (weather['rain'] & time['evening'] & light['bright']) |
                            (weather['rain'] & time['evening'] & light['dark']) |
                            (weather['snow'] & time['morning'] & light['bright']) |
                            (weather['snow'] & time['morning'] & light['dark']) |
                            (weather['snow'] & time['day'] & light['bright']) |
                            (weather['snow'] & time['day'] & light['dark']) |
                            (weather['snow'] & time['evening'] & light['bright']),
                            dn['day'])

        self.rules.update({'2.1': rule2_1})

        rule2_2 = ctrl.Rule((weather['clean'] & time['evening'] & light['dusk']) |
                            (weather['clean'] & time['night'] & light['dark']) |
                            (weather['clean'] & time['night'] & light['dusk']) |
                            (weather['cloudy'] & time['morning'] & light['dark']) |
                            (weather['cloudy'] & time['evening'] & light['dark']) |
                            (weather['cloudy'] & time['night']) |
                            (weather['rain'] & time['evening'] & light['dark']) |
                            (weather['rain'] & time['night'] & light['dark']) |
                            (weather['hrain'] & time['morning'] & light['dark']) |
                            (weather['hrain'] & time['morning'] & light['dark']) |
                            (weather['hrain'] & time['day'] & light['dark']) |
                            (weather['hrain'] & time['day'] & light['dark']) |
                            (weather['hrain'] & time['evening'] & light['dark']) |
                            (weather['hrain'] & time['evening'] & light['dark']) |
                            (weather['hrain'] & time['night'] & light['dark']) |
                            (weather['snow'] & time['evening'] & light['dark']) |
                            (weather['snow'] & time['evening'] & light['dark']) |
                            (weather['snow'] & time['night'] & light['dark']) |
                            (weather['hsnow']),
                            dn['night'])

        self.rules.update({'2.2': rule2_2})

        # Правила подсветки
        rule3_1 = ctrl.Rule((weather['rain'] & time['morning'] & light['bright']) |
                            (weather['rain'] & time['day'] & light['bright']) |
                            (weather['rain'] & time['evening'] & light['bright']) |
                            (weather['snow'] & time['morning'] & light['bright']) |
                            (weather['snow'] & time['day'] & light['bright']),
                            lightning['0'])

        self.rules.update({'3.1': rule3_1})

        rule3_2 = ctrl.Rule((weather['clean'] & time['evening'] & light['dusk']) |
                            (weather['clean'] & time['night'] & light['dusk']) |
                            (weather['cloudy'] & time['morning'] & light['bright']) |
                            (weather['cloudy'] & time['day']) |
                            (weather['rain'] & time['day'] & light['dark']) |
                            (weather['snow'] & time['day'] & light['dark']) |
                            (weather['snow'] & time['evening'] & light['bright']),
                            lightning['1'])

        self.rules.update({'3.2': rule3_2})

        rule3_3 = ctrl.Rule((weather['clean'] & time['night'] & light['dark']) |
                            (weather['cloudy'] & time['morning'] & light['dusk']) |
                            (weather['cloudy'] & time['evening'] & light['dusk']) |
                            (weather['rain'] & time['morning'] & light['dark']) |
                            (weather['rain'] & time['evening'] & light['dark']) |
                            (weather['hrain'] & time['morning'] & light['dark']) |
                            (weather['hrain'] & time['day'] & light['dark']) |
                            (weather['hrain'] & time['evening'] & light['dark']) |
                            (weather['snow'] & time['morning'] & light['dark']) |
                            (weather['snow'] & time['evening'] & light['dark']),
                            lightning['2'])

        self.rules.update({'3.3': rule3_3})

        rule3_4 = ctrl.Rule((weather['cloudy'] & time['morning'] & light['dark']) |
                            (weather['cloudy'] & time['evening'] & light['dark']) |
                            (weather['cloudy'] & time['night']) |
                            (weather['rain'] & time['evening'] & light['dark']) |
                            (weather['rain'] & time['night'] & light['dark']) |
                            (weather['hrain'] & time['morning'] & light['dark']) |
                            (weather['hrain'] & time['day'] & light['dark']) |
                            (weather['hrain'] & time['evening'] & light['dark']) |
                            (weather['hrain'] & time['night'] & light['dark']) |
                            (weather['snow'] & time['evening'] & light['dark']) |
                            (weather['snow'] & time['night'] & light['dark']) |
                            (weather['hsnow']),
                            lightning['3'])

        self.rules.update({'3.4': rule3_4})

        # Дополнительные переменные для перевода выводов, во входные данные
        noise2 = ctrl.Antecedent(np.arange(0, 4, 0.01), 'noise2')
        dn2 = ctrl.Antecedent(np.arange(0, 2, 0.01), 'dn2')

        noise2['low'] = fuzz.trimf(noise.universe, [-0.8, 0, 0.8])
        noise2['medium'] = fuzz.trimf(noise.universe, [0.4, 1, 1.6])
        noise2['high'] = fuzz.trimf(noise.universe, [1.2, 2, 2.8])

        dn2['day'] = fuzz.trimf(dn.universe, [-1, 0, 0.6])
        dn2['night'] = fuzz.trimf(dn.universe, [0.3, 1, 1])

        # Правила автофокуса
        rule4_1 = ctrl.Rule((movement['low'] & noise2['low']) |
                            (movement['low'] & noise2['medium']) |
                            (movement['low'] & noise2['high']) |
                            (movement['high'] & noise2['high']),
                            focus['0'])

        self.rules.update({'4.1': rule4_1})

        rule4_2 = ctrl.Rule((dn2['night']) |
                            (movement['high'] & noise2['low']) |
                            (movement['high'] & noise2['high']),
                            focus['1'])

        self.rules.update({'4.2': rule4_2})

        # Правила очистки от шумов
        rule5_1 = ctrl.Rule((dn2['night']) |
                            (movement['low'] & noise2['low']) |
                            (movement['low'] & noise2['medium']) |
                            (movement['high'] & noise2['low']),
                            cleaning['0'])

        self.rules.update({'5.1': rule5_1})

        rule5_2 = ctrl.Rule((movement['low'] & noise2['high']) |
                            (movement['high'] & noise2['medium']) |
                            (movement['high'] & noise2['high']),
                            cleaning['1'])

        self.rules.update({'5.2': rule5_2})

        # Правила подогрева
        rule6_1 = ctrl.Rule(temp['0'], heating['1'])

        self.rules.update({'6.1': rule6_1})

        rule6_2 = ctrl.Rule(temp['-10'], heating['2'])

        self.rules.update({'6.2': rule6_2})

        rule6_3 = ctrl.Rule(temp['-20'], heating['3'])

        self.rules.update({'6.3': rule6_3})

        rule6_4 = ctrl.Rule(temp['-40'], heating['4'])

        self.rules.update({'6.4': rule6_4})

# k = FuzzyControlCamera()
# #print(k.rules)
# print(k.compute())
