import subprocess
import threading
import os
import config


class VLCServer(object):

    def __init__(self):
        self.base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.vlc_path = os.path.join(self.base_dir, "camera\\vlc\\vlc.exe")
        self.vlc_exter_ip = config.CAMERA
        self.vlc_inter_ip = config.VLC_PROXY
        self.vlc_inter_ip_cmd = "{access=http,dst=" + self.vlc_inter_ip + "}"
        self.network_caching = 1000
        self.sub_process_vlc = None
        self.thread_vlc = None

    def get_external_ip(self):
        return self.vlc_exter_ip

    def get_inter_ip(self):
        return self.vlc_inter_ip

    def start_thread(self):
        self.thread_vlc = threading.Thread(target=self.start)
        self.thread_vlc.start()
        return True

    def start(self):
        print("....vlc work begin....")
        command = self.vlc_path + " -I none -vvv {0} " \
                                  "--sout #standard{1}".format(self.vlc_exter_ip,self.vlc_inter_ip_cmd)
        self.sub_process_vlc = subprocess.Popen(command, shell=False)
        print("....vlc work done....")


    def stop(self):
        print("....vlc stop begin....")
        self.sub_process_vlc.terminate()
        print("....vlc stop done....")

    def stop_thread(self):
        self.stop()
        self.thread_vlc = None