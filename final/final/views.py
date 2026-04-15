from django.shortcuts import redirect, render
from django.views.decorators.csrf import ensure_csrf_cookie
import os
from . import settings, db_controller


def save_file(file):
    upload_path = os.path.join(settings.BASE_DIR, 'module/static/uploads', file.name)

    os.makedirs(os.path.dirname(upload_path), exist_ok=True)

    with open(upload_path, 'wb') as d:
        for chunk in file.chunks():
            d.write(chunk)

    file_url = file.name
    return file_url

@ensure_csrf_cookie
def login(request):
    data = {
        'login' : '',
        'password': ''
    }
    if request.method == 'GET':
        return render(request, 'login.html', context=data)
    name = request.POST.get('login')
    password = request.POST.get('password')
    db = db_controller.Db()
    auth = db.auth(name, password)
    if type(auth) == bool:
        request.session['auth'] = True
        request.session['perm'] = db.per
        return redirect('/')
    if auth == 'Не правильный пароль':
        data['password'] = 'Не правильный пароль'
    else:
        data['login'] = 'Не правильный логин'
    return render(request, 'login.html', context=data)

@ensure_csrf_cookie
def registation(request):
    data = {
        'login': '',
        'password': ''
    }
    if request.method == 'GET':
        return render(request, 'register.html', context=data)
    name = request.POST.get('display_name')
    login = request.POST.get('username')
    password = request.POST.get('password')
    db = db_controller.Db()
    auth = db.registration(name, login, password)
    if type(auth) == bool:
        request.session['auth'] = True
        request.session['perm'] = db.per
        return redirect('/')
    if auth == 'Не правильный пароль':
        data['password'] = 'Не правильный пароль'
    else:
        data['login'] = 'Не правильный логин, имя или пароль'
    return render(request, 'register.html', context=data)

@ensure_csrf_cookie
def index(request):
    db = db_controller.Db()
    data = {
        'data': db.getTraditions()
    }
    if 'auth' not in request.session:
        request.session['auth'] = False
        request.session['perm'] = 0
    return render(request, 'index.html', context=data)
