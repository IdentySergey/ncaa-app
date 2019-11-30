from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^api/hardware/platform/left/$', views.ApiSwivelPlatformLeft.as_view(), name='users_objects'),

    url(r'^api/hardware/platform/right/$', views.ApiSwivelPlatformRight.as_view(), name='users_objects'),

    url(r'^api/hardware/platform/top/$', views.ApiSwivelPlatformTop.as_view(), name='users_objects'),

    url(r'^api/hardware/platform/bottom/$', views.ApiSwivelPlatformBottom.as_view(), name='users_objects'),

    url(r'^api/hardware/platform/stop/$', views.ApiSwivelPlatformStop.as_view(), name='users_objects'),
]
