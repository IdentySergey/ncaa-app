from django.shortcuts import render
from django.shortcuts import redirect

from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status

from django.db.models import Q

from access_list.models import AccessList
from access_list.serializer import AccessListSerializer
from access_system.pagination import Pagination


def access_list_page(request):
    if request.user.is_authenticated:
        return render(request, template_name='index.html')
    else:
        return redirect('/login')


class ApiAccessListObject(APIView):
    def get(self, request, pk, format=None):
        item = AccessList().get_by_id(id=pk)
        if item is not None:
            serializer = AccessListSerializer(item)
            return Response(status=status.HTTP_200_OK, data=serializer.data)
        return Response(status=status.HTTP_404_NOT_FOUND)

    def post(self, request, format=None):
        if "number" in request.data:
            request.data["number"] = request.data["number"].upper()
        serializer = AccessListSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        result = AccessList().delete_by_id(pk)
        if result is True:
            return Response(status.HTTP_200_OK)
        else:
            return Response(status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk, format=None):
        item = AccessList().get_by_id(pk)
        if "number" in request.data:
            request.data["number"] = request.data["number"].upper()
        serializer = AccessListSerializer(item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ApiAccessListObjects(generics.ListAPIView):
    queryset = AccessList.objects.all().filter()
    serializer_class = AccessListSerializer

    def list(self, request):
        search = self.request.query_params.get('search', None)
        ordering = self.request.query_params.get('ordering', None)

        if search is not None:

            self.queryset = self.get_queryset().filter(
                Q(ownerName__contains=search) | Q(mark__contains=search) | Q(number__contains=search))
        else:
            self.queryset = self.get_queryset()

        if ordering is not None and ordering is not '':
            self.queryset = self.queryset.order_by(ordering)

        pagination = Pagination()
        page = pagination.paginate_queryset(self.queryset, request)
        serializer = AccessListSerializer(page, many=True)

        return pagination.get_paginated_response(serializer.data)
