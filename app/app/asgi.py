"""
ASGI config for app project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""


import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')

django.setup()
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.sessions import SessionMiddlewareStack
import comments_app.routing


application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket":SessionMiddlewareStack (
        AuthMiddlewareStack(
            URLRouter(
            comments_app.routing.websocket_urlpatterns
            )
        )
    ),
})
