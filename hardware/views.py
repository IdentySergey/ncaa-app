from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import hardware.proxy as hardware
import os



class ApiSwivelPlatformLeft(APIView):
    def post(self, request, format=None):
        swivel_platform = hardware.SwivelPlatformProxy()
        swivel_platform.left()
        print("left direction start")
        return Response(status=status.HTTP_200_OK)


class ApiSwivelPlatformRight(APIView):
    def post(self, request, format=None):
        swivel_platform = hardware.SwivelPlatformProxy()
        swivel_platform.right()
        print("right direction start")
        return Response(status=status.HTTP_200_OK)


class ApiSwivelPlatformTop(APIView):
    def post(self, request, format=None):
        swivel_platform = hardware.SwivelPlatformProxy()
        swivel_platform.top()
        print("top direction start")
        return Response(status=status.HTTP_200_OK)


class ApiSwivelPlatformBottom(APIView):
    def post(self, request, format=None):
        swivel_platform = hardware.SwivelPlatformProxy()
        swivel_platform.bottom()
        print("bottom direction start")
        return Response(status=status.HTTP_200_OK)


class ApiSwivelPlatformStop(APIView):
    def post(self, request, format=None):
        swivel_platform = hardware.SwivelPlatformProxy()
        swivel_platform.stop()
        print("stop direction start")
        return Response(status=status.HTTP_200_OK)


class ApiRasberryAlive(APIView):
    def get(self, request, format=None):
        hostname = "taylor"
        response = os.system("ping -c 1 " + hostname)
        # and then check the response...
        if response == 0:
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)


class ApiCameraAlive(APIView):
    def get(self, request, format=None):
        hostname = "taylor"
        response = os.system("ping -c 1 " + hostname)
        if response == 0:
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
