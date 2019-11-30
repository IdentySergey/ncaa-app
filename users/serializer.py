from rest_framework import serializers
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
import users.models as model


class UserBase(serializers.Serializer):
    username = serializers.CharField(max_length=255, required=True)
    first_name = serializers.CharField(max_length=255, required=True)
    last_name = serializers.CharField(max_length=255, required=True)
    email = serializers.EmailField(required=True)
    last_login = serializers.DateTimeField(required=False)

    def validate_username(self, data):
        if self.initial_data is not None and self.initial_data['username'] is data:
            return data
        if model.User.objects.filter(username=data).first():
            raise serializers.ValidationError("user is registered")
        return data

    def validate_email(self, data):
        if self.initial_data is not None and self.initial_data['email'] is data:
            return data
        if model.User.objects.filter(email=data).first():
            raise serializers.ValidationError("email is registered")
        return data


class UserSerializers(UserBase):
    id = serializers.IntegerField(required=True)


class UpdateUserSerializers(UserBase):
    password = serializers.CharField(max_length=255, min_length=6, allow_blank=True)

    def update(self, instance, validated_data):
        instance.username = validated_data["username"]
        instance.first_name = validated_data["first_name"]
        instance.last_name = validated_data["last_name"]
        instance.email = validated_data["email"]
        if (validated_data["password"] is not "") and (validated_data["password"] is not None):
            instance.set_password(validated_data["password"])
        instance.save()
        return instance


class RegistrationUserSerializers(UserBase):
    password = serializers.CharField(max_length=255, min_length=6, required=True)

    def validate_username(self, data):
        if model.User.objects.filter(username=data).first():
            raise serializers.ValidationError("user is registered")
        return data

    def create(self, validated_data):
        new_user = User()
        new_user.username = validated_data["username"]
        new_user.first_name = validated_data["first_name"]
        new_user.last_name = validated_data["last_name"]
        new_user.email = validated_data["email"]
        new_user.set_password(validated_data["password"])
        new_user.is_active = True
        new_user.save()
        return new_user


class AuthenticationSerializers(serializers.Serializer):
    username = serializers.CharField(required=True,
                                     max_length=255,
                                     min_length=2)

    password = serializers.CharField(required=True,
                                     max_length=255,
                                     min_length=6)

    def validate_username(self, data):
        if model.User.objects.filter(username=data).first() is None:
            raise serializers.ValidationError("not_registration")
        return data

    def validate(self, attrs):
        auth = authenticate(username=attrs["username"], password=attrs["password"])
        if auth is None:
            raise serializers.ValidationError("bad_password")
        return attrs

    def get_user(self):
        return model.User.objects.filter(username=self.validated_data["username"]).first()

    def token(self):
        user = model.User.objects.filter(username=self.validated_data["username"]).first()
        token = Token.objects.get_or_create(user=user)
        response = {
            'username': user.username,
            'displayName': user.first_name + " " + user.last_name,
            'token': token[0].key
        }
        return response
