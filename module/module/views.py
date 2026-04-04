import os

from django.shortcuts import redirect, render
from django.views.decorators.csrf import ensure_csrf_cookie
from . import mysql_connect, settings
@ensure_csrf_cookie
def index(request):
    if 'auth' not in request.session:
        request.session['auth'] = False
        request.session['id'] = -1
    if not request.session['auth']:
        if request.method == 'GET':
            data = {
                'email_error': ['gray', ''],
                'password_error': ['gray', '']

            }
            return render(request, 'index.html', context=data)
        else:
            try:
                db = mysql_connect.Db()
                email = request.POST.get('email')
                password = request.POST.get('password')
                if db.auth(email, password):
                    request.session['auth'] = True
                    request.session['id'] = db.id
                    return redirect('127.0.0.1:5000')
                data = {
                    'email_error': ['red', 'Ошибка Mysql'],
                    'password_error': ['red', 'Ошибка Mysql']
                }
                return render(request, 'index.html', context=data)
            except ValueError as text:
                if text == 'Email error':
                    data = {
                        'email_error': ['red', text],
                        'password_error': ['gray', '']
                    }
                else:
                    data = {
                        'email_error': ['gray', ''],
                        'password_error': ['red', text]
                    }
                return render(request, 'index.html', context=data)
    else:
        db = mysql_connect.Db()
        books = db.getBooks()
        data = {'data': books}
        return render(request, 'books.html', context=data)

def registarion(request):
    if request.method == 'GET':
        data = {
            'email_error': ['gray', ''],
            'password_error': ['gray', '']
        }
        return render(request, 'signup.html', context=data)
    else:
        try:
            db = mysql_connect.Db()
            email = request.POST.get('email')
            password = request.POST.get('password')
            rg = db.registarion(email, password)
            if rg and type(rg) == bool:
                request.session['auth'] = True
                request.session['id'] = db.id
                return redirect('')
            elif type(rg) != bool:
                raise ValueError(rg)
            data = {
                'email_error': ['red', 'Ошибка Mysql'],
                'password_error': ['red', 'Ошибка Mysql']
            }
            return render(request, 'signup.html', context=data)
        except ValueError as text:
            if text == 'Email error':
                data = {
                    'email_error': ['red', text],
                    'password_error': ['gray', '']
                }
            else:
                data = {
                    'email_error': ['gray', ''],
                    'password_error': ['red', text]
                }
            return render(request, 'signup.html', context=data)
