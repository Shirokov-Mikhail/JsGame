from django.shortcuts import redirect, render
from django.views.decorators.csrf import ensure_csrf_cookie
from . import mysql_connect

@ensure_csrf_cookie
def index(request):
    if 'auth' and 'perm' not in request.session:
        request.session['auth'] = False
        request.session['perm'] = 0

    if bool(request.session['auth']):
        data = {
            'email_error': ['white', ''],
            'password_error': ['white', '']}
        if request.method == 'POST':
            mail = request.POST.get('email')
            password = request.POST.get('password')
            db = mysql_connect.Db()
            print('123 ', password, mail)
            if db.auth(mail, password):
                request.session['auth'] = True
                request.session['perm'] = db.permissions
                request.session['id'] = db.id
                return redirect('127.0.0.1:5000')
            data['email_error'] = ['red', 'Не правильный Email']
            data['password_error'] = ['red', 'Не правильный Пароль']
        return render(request, 'index.html', context=data)
    else:
        data = {

        }
