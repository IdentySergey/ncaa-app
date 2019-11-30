from django.conf.urls import url, include
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.contrib import admin
import users.views
import detector.views

# VIEW

urlpatterns = [
    # url(r'^admin/', admin.site.urls),

    url(r'^$', users.views.index_page, name='index'),

    url(r'', include('access_list.urls'), name='access-list'),

    url(r'', include('detector.urls'), name='camera'),

    url(r'', include('users.urls'), name='users'),

    url(r'', include('hardware.urls'), name='hardware')

]

urlpatterns += staticfiles_urlpatterns()
