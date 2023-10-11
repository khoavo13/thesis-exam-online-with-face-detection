from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('recognize/', views.recognize_face),
    path('register/', views.register_face),
]