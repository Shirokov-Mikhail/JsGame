from colorsys import rgb_to_hls

from django.shortcuts import redirect, render
from django.views.decorators.csrf import ensure_csrf_cookie
import os
from . import mysql, settings

class Functions:
    def save_file(self, file):
        upload_path = os.path.join(settings.BASE_DIR, 'module/static/uploads', file.name)

        os.makedirs(os.path.dirname(upload_path), exist_ok=True)

        with open(upload_path, 'wb') as d:
            for chunk in file.chunks():
                d.write(chunk)

        file_url = file.name
        return file_url

    def check_len(self, value:str, length=100):
        if len(value) > length:
            return True
        return False

    def check_inputs(self, name, author, desk, year:int, data):
        erors = False
        if self.check_len(name):
            data['error_name'] = ['red', 'block']
            erors = True
        if self.check_len(author):
            data['error_author'] = ['red', 'block']
            erors = True
        if self.check_len(desk):
            data['description_error'] = ['red', 'block']
            erors = True
        if year < 1800 or year > 2026:
            data['error_year'] = ['red', 'block']
            erors = True
        return [data, not erors]

    def check_auth(self, value, data):
        if isinstance(value, ValueError):
            if str(value) == 'email':
                data['email_error'] = ['red', value]
                data['password_error'] = ['#ddd', '']
            elif str(value) == 'password':
                data['email_error'] = ['ddd', '']
                data['password_error'] = ['red', value]
            else:
                data['email_error'] = ['red', value]
                data['password_error'] = ['red', value]
            return [False, data]
        elif value and isinstance(value, bool):
            return [True, data]

        data['email_error'] = ['red', value]
        data['password_error'] = ['red', value]
        return [False, data]

@ensure_csrf_cookie
def index(request):
    data = {
        'email_error': ['#ddd', ''],
        'password_error': ['#ddd', '']
    }
    if 'auth' not in request.session:
        request.session['auth'] = False
    if not bool(request.session['auth']):
        if request.method == 'GET':
            return render(request, 'index.html', context=data)
        db = mysql.Db()
        mail = request.POST.get('email')
        password = request.POST.get('password')
        rg = db.auth(mail, password)
        f = Functions()
        rg, data = f.check_auth(rg, data)
        if rg:
            request.session['auth'] = True
            return redirect('/books/0')
        return render(request, 'index.html', context=data)
    return render('/books/0')

def books(request, page:int):
    db = mysql.Db()
    book = db.getBooks()
    filterid = False
    data = {'data': books[page * 6: page * 6 + 6],
            'undo_page': page - 1,
            'page': page,
            'next_page': page + 1
            }
    if request.method == 'POST':
        if 'search_genre' in request.POST:
            data['data'] = list(filter(lambda x: x[4] == request.POST.get('search_genre'), book))
            book = data['data']
        elif 'alpha' in request.POST:
            data['data'] = sorted(book, key=request.POST.get('alpha'))

        elif 'search' in request.POST:
            data['data'] = list(filter(lambda x:x[1].lower() == request.POST.get('search').lower(), book))

    if len(book) < 6:
        data['next_page'] = page
        data['undo_page'] = page
    elif page == 0:
        data['undo_page'] = page
    return render(request, 'books.html', context=data)

@ensure_csrf_cookie
def auth(request):
    request.session['auth'] = False
    return redirect('/')

@ensure_csrf_cookie
def registration(request):
    data = {
        'email_error': ['#ddd', ''],
        'password_error': ['#ddd', '']
    }
    if 'auth' not in request.session:
        request.session['auth'] = False
    if not bool(request.session['auth']):
        if request.method == 'GET':
            return render(request, 'signup.html', context=data)
        db = mysql.Db()
        mail = request.POST.get('email')
        password = request.POST.get('password')
        rg = db.registaration(mail, password)
        f = Functions()
        rg, data = f.check_auth(rg, data)
        if rg:
            request.session['auth'] = True
            return redirect('/books/0')
        return render(request, 'signup.html', context=data)
    return render('/books/0')

