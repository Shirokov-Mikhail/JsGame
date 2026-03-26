from django.shortcuts import redirect, render
from django.views.decorators.csrf import ensure_csrf_cookie
from . import mysql_connect

def index(request):
    data = {
        'email_error': ['white', ''],
        'password_error':['white', '']}
    if request.method == 'POST':
        mail = request.POST.get('email')
        password = request.POST.get('password')
        db = mysql_connect.Db()
        if db.auth(mail, password):
            return redirect('')
        data['email_error'] = ['red', 'Не правильный Email']
        data['password_error'] = ['red', 'Не правильный Пароль']
    return render(request,'index.html', context=data)

def books(request):
    data = {
        '': []
    }