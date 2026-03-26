"""
URL configuration for moduleB project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from . import vievs

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', vievs.index),
    path('add_new_book/', vievs.add_new_film),
    path('edit_book/<id>', vievs.edit_films),
    path('edit_old_book/', vievs.edit_old_film),#убрать addfilm он тут для теста
]

