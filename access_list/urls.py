from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^access-list/$', views.access_list_page, name="access_list_page"),

    url(r'^api/access-list/$', views.ApiAccessListObject.as_view(), name='access_create_object'),

    url(r'^api/access-list/(?P<pk>\d+)/$', views.ApiAccessListObject.as_view(), name='access_list_object'),

    url(r'^api/access-list/list/$', views.ApiAccessListObjects.as_view(), name='access_list_objects'),

    url(r'^api/access-list/list/', views.ApiAccessListObjects.as_view(), name='access_list_objects'),
]