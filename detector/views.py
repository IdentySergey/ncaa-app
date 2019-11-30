from django.shortcuts import render
from django.shortcuts import redirect
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import StreamingHttpResponse, HttpResponse
from django.views.decorators.http import condition
from .serializer import DetectorSerializer
from .models import Detector
from django.db.models import Q

from access_system.pagination import Pagination

from access_system.wsgi import intelligence


def camera_page(request):
    if request.user.is_authenticated:
        return render(request, template_name='index.html')
    else:
        return redirect('/login')


def detection_page(request):
    if request.user.is_authenticated:
        return render(request, template_name='index.html')
    else:
        return redirect('/login')


class ApiDetected(APIView):
    def get(self, request, id, format=None):
        detected = Detector().get_by_id(id)
        if detected is not None:
            serializer = DetectorSerializer(detected)
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, id, format=None):
        ret = Detector().delete_by_id(id)
        if ret:
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request, id, format=None):
        detected = Detector().get_by_id(id)
        if detected is not None:
            serializer = DetectorSerializer(detected, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(data=serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ApiDetections(generics.ListAPIView):
    queryset = Detector.objects.order_by("-detected").all()
    serializer_class = DetectorSerializer

    def list(self, request, *args, **kwargs):
        search = self.request.query_params.get('search', None)
        ordering = self.request.query_params.get('ordering', None)

        if search is not None:
            search = search.upper()
            self.queryset = self.get_queryset().filter(
                Q(number__contains=search))
        else:
            self.queryset = self.get_queryset()

        if ordering is not None and ordering is not '':
            self.queryset = self.queryset.order_by(ordering)

        pagination = Pagination()
        page = pagination.paginate_queryset(self.queryset, request)
        serializer = DetectorSerializer(page, many=True)

        return pagination.get_paginated_response(serializer.data)


class ApiNowDetections(generics.ListAPIView):
    queryset = Detector.objects.order_by("-detected").all()
    serializer_class = DetectorSerializer

    def list(self, request, *args, **kwargs):
        pagination = Pagination()
        page = pagination.paginate_queryset(self.queryset, request)
        serializer = DetectorSerializer(page, many=True)
        return pagination.get_paginated_response(serializer.data)


@condition(etag_func=None)
def camera_view(request):
    if request.user.is_authenticated:
        if intelligence.get_camera_status():
            return StreamingHttpResponse(streaming_content=intelligence.get_mjpeg(),
                                         content_type="multipart/x-mixed-replace; boundary=frame")
        else:
            return HttpResponse(intelligence.get_mjpeg(), content_type="image/jpeg")
    else:
        return HttpResponse(status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class ApiFuzzy(APIView):
    def get(self, request, format=None):
        control = intelligence.get_fuzzy()
        return Response(data=control, status=status.HTTP_200_OK)
