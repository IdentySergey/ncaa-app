from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^users/$', views.users_page, name="users_page"),

    url(r'^login/', views.login_page, name='login'),

    url(r'^logout/', views.logout_page, name='logout'),

    url(r'^api/login/$', views.APILogin.as_view(), name='users_create_object'),

    url(r'^api/users/$', views.ApiUser.as_view(), name='users_create_object'),

    url(r'^api/users/(?P<id>\d+)/$', views.ApiUser.as_view(), name='user_object'),

    url(r'^api/users/list/$', views.ApiUsers.as_view(), name='users_objects'),

    url(r'^api/users/list/', views.ApiUsers.as_view(), name='users_objects'),

    url(r'^api/users/current/$', views.ApiGetCurrentUser.as_view(), name='users_objects'),
]
