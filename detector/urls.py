from django.conf.urls import url
from . import views

urlpatterns = [

    url(r'^camera/$', views.camera_page, name='camera_page'),

    url(r'^detection/$', views.detection_page, name='camera_page'),

    url(r'^camera/view/$', views.camera_view, name='camera_render'),

    url(r'^api/detections/fuzzy/$', views.ApiFuzzy.as_view(), name='camera_render'),

    url(r'^api/detections/(?P<id>\d+)/$', views.ApiDetected.as_view(), name="event"),

    url(r'^api/detections/list/$', views.ApiDetections.as_view(), name="events"),

    url(r'^api/detections/now/$', views.ApiNowDetections.as_view(), name="now")
]
