import requests
import config


class SwivelPlatformProxy(object):
    def left(self):
        try:
            self.connect()
            url = config.DEVICE_API + "left/"
            r = requests.get(url)
            if r.status_code is not 200:
                return False
            return True
        except:
            return False

    def right(self):
        try:
            self.connect()
            url = config.DEVICE_API + "right/"
            r = requests.get(url)
            if r.status_code is not 200:
                return False
            return True
        except:
            return False

    def top(self):
        try:
            self.connect()
            url = config.DEVICE_API + "up/"
            r = requests.get(url)
            if r.status_code is not 200:
                return False
            return True
        except:
            return False

    def bottom(self):
        try:
            self.connect()
            url = config.DEVICE_API + "bottom/"
            r = requests.get(url)
            if r.status_code is not 200:
                return False
            return True
        except:
            return False

    def stop(self):
        try:
            url = config.DEVICE_API + "stop/"
            r = requests.get(url)
            if r.status_code is not 200:
                return False
            self.disconnect()
            return True
        except:
            return False

    def connect(self):
        try:
            url = config.DEVICE_API + "connect/"
            r = requests.get(url)
            if r.status_code is not 200:
                return False
            return True
        except:
            return False


    def disconnect(self):
        try:
            url = config.DEVICE_API + "disconnect/"
            r = requests.get(url)
            if r.status_code is not 200:
                return False
            return True
        except:
            return False



class IRProjectorProxy(object):
    def on(self):
        pass

    def off(self):
        pass

    def brightness(self):
        pass
