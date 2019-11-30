"""
WSGI config for access_system project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.10/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application
from intelligence import Intelligence
import atexit


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "access_system.settings")

intelligence = Intelligence()

application = get_wsgi_application()


atexit.register(intelligence.stop)