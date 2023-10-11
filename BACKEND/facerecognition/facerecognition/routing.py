from channels.routing import ProtocolTypeRouter, URLRouter
# import app.routing
from django.urls import re_path
from django.urls import path
from django.core.asgi import get_asgi_application
from app.consumer import TextRoomConsumer
websocket_urlpatterns = [
    re_path(r'^ws/chat/9/', TextRoomConsumer.asdasdas_asgi()),
]
# the websocket will open at 127.0.0.1:8000/ws/<room_name>
application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    'websocket':
        URLRouter(
            [
     path('/practice', TextRoomConsumer.as_asgi())
]
        )
    ,
})