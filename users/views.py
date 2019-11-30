from django.shortcuts import redirect
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from django.contrib.auth import login, logout
from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from access_system.pagination import Pagination


import users.serializer


def index_page(request):
    if request.user.is_authenticated:
        return redirect('/camera')
    else:
        return redirect('/login')


def users_page(request):
    if request.user.is_authenticated:
        return render(request, template_name='index.html')
    else:
        return redirect('/login')


def login_page(request):
    if request.user.is_authenticated:
        return redirect('/camera')
    else:
        return render(request, template_name='index.html')


def logout_page(request):
    if request.user.is_authenticated:
        logout(request)
    return redirect('/login')



class APILogin(APIView):
    def post(self, request, format=None):
        serializer = users.serializer.AuthenticationSerializers(data=request.data)
        if serializer.is_valid():
            user = serializer.get_user()
            login(request, user)
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class APIToken(APIView):
    def post(self, request, format=None):
        serializer = users.serializer.AuthenticationSerializers(data=request.data)
        if serializer.is_valid():
            token = serializer.token()
            return Response(data=token, status=status.HTTP_200_OK)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ApiUser(APIView):
    def get(self, request, id, format=None):
        user = User.objects.filter(id=id).first()
        if user is not None:
            serializer = users.serializer.UserSerializers(user)
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def post(self, request, format=None):
        serializer = users.serializer.RegistrationUserSerializers(data=request.data)
        if serializer.is_valid():
            new_user = serializer.save()
            serializer_new_user = users.serializer.UserSerializers(new_user)
            return Response(data=serializer_new_user.data, status=status.HTTP_200_OK)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id, format=None):
        user = User.objects.filter(id=id).first()
        if user is not None:
            user.delete()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request, id, format=None):
        user = User.objects.filter(id=id).first()
        serializer = users.serializer.UpdateUserSerializers(user, data=request.data)
        if serializer.is_valid():
            user_updated = serializer.save()
            serializer_updated_user = users.serializer.UserSerializers(user_updated)
            return Response(data=serializer_updated_user.data, status=status.HTTP_200_OK)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ApiGetCurrentUser(APIView):
    authentication_classes = (SessionAuthentication, BasicAuthentication)

    def get(self, request, format=None):
        if request.user.is_authenticated:
            serializer = users.serializer.UserSerializers(request.user)
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(status.HTTP_404_NOT_FOUND)


class ApiUsers(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = users.serializer.UserSerializers

    def list(self, request):
        search = self.request.query_params.get('search', None)
        ordering = self.request.query_params.get('ordering', None)

        if search is not None:
            self.queryset = self.get_queryset().filter(
                Q(username__contains=search) |
                Q(first_name__contains=search) |
                Q(last_name__contains=search) |
                Q(email__contains=search))
        else:
            self.queryset = self.get_queryset()

        if ordering is not None and ordering is not '':
            self.queryset = self.queryset.order_by(ordering)


        pagination = Pagination()
        page = pagination.paginate_queryset(self.queryset, request)
        serializer = users.serializer.UserSerializers(page, many=True)

        return pagination.get_paginated_response(serializer.data)
