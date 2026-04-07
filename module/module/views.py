import os

from django.shortcuts import redirect, render
from django.views.decorators.csrf import ensure_csrf_cookie
from . import mysql_connect, settings


class Functions:
    def __init__(self):
        pass

    def save_file(self, file):
        upload_path = os.path.join(settings.BASE_DIR, 'module/static/uploads/', file.name)

        os.makedirs(os.path.dirname(upload_path), exist_ok=True)

        with open(upload_path, 'wb+') as destination:
            for chunk in file.chunks():
                destination.write(chunk)

        file_url = f'uploads/{file.name}'
        return file_url

    def check_len(self, value, max_len=100):
        if len(value) > max_len:
            return True
        return False

    def check_input_errors(self,name, author, description, year, data):
        errors = False
        if len(description) > 500:
            data['description_error'] = ['red', 'block']
            errors = True
        if len(name) > 100:
            data['error_name'] = ['red', 'block']
            errors = True
        if len(author) > 100:
            data['error_author'] = ['red', 'block']
            errors = True
        if int(year) < 1800 or int(year) > 2026:
            data['error_year'] = ['red', 'block']
            errors = True
        return [data, not errors]

    def check_auth(self, retr, data):
        if isinstance(retr, ValueError):
            if retr == 'Email error':
                data['email_error'] = ['red', retr]
                data['password_error'] = ['#ddd', '']
            elif retr == 'Password error':
                data['email_error'] = ['ddd', '']
                data['password_error'] = ['red', retr]
            else:
                data['email_error'] = ['red', retr]
                data['password_error'] = ['red', retr]
            return [False, data]
        elif retr and isinstance(retr, bool):
            return [True, data]

        data['email_error'] = ['red', retr]
        data['password_error'] = ['red', retr]
        return [False, data]

@ensure_csrf_cookie
def index(request):
    if 'auth' not in request.session:
        request.session['auth'] = False
    if not request.session['auth']:
        data = {
            'email_error': ['#ddd', ''],
            'password_error': ['#ddd', '']

        }
        if request.method == 'GET':
            return render(request, 'index.html', context=data)
        else:
            db = mysql_connect.Db()
            email = request.POST.get('email')
            password = request.POST.get('password')
            rg = db.auth(email, password)
            f = Functions()
            all_return = f.check_auth(rg, data)
            data = all_return[1]
            rg = all_return[0]
            if rg:
                request.session['auth'] = True
                return redirect('/books/0')
            return render(request, 'index.html', context=data)

    else:
        return redirect('/books/0')

@ensure_csrf_cookie
def books(request, page):
    page = int(page)
    db = mysql_connect.Db()
    books = db.getBooks()
    filterid = False
    data = {'data': books[page * 6: page * 6 + 6],
            'undo_page': page - 1,
            'page': page,
            'next_page': page + 1
            }
    if request.method == 'POST':
        data['data'] = books
        filterid = True
        if 'search_genre' in request.POST:
            data['data'] = list(filter(lambda x: x[4] == request.POST.get('search_genre'), data['data']))

        if 'alpha' in request.POST:
            data['data'] = list(sorted(data['data']))
            if request.POST.get('alpha'):
                data['data'].reverse()

        if 'search' in request.POST:
            data['data'] = list(filter(lambda x: x[1] == request.POST.get('search'), data['data']))


    if len(books) < 6 and not filterid:
        data['next_page'] = page
        data['undo_page'] = page
    elif filterid and len(data['data']) < 6:
        data['next_page'] = page
        data['undo_page'] = page
    elif page == 0 and not filterid:
        data['undo_page'] = page
    elif len(books) - 6 * page < 6 or len(data['data']) - 6 * page:
        data['next_page'] = page



    return render(request, 'books.html', context=data)

@ensure_csrf_cookie
def auth(request):
    request.session['auth'] = False
    return redirect('/')

@ensure_csrf_cookie
def registarion(request):
    if 'auth' not in request.session:
        request.session['auth'] = False
    data = {
        'email_error': ['#ddd', ''],
        'password_error': ['#ddd', '']
    }
    if request.method == 'GET':
        return render(request, 'signup.html', context=data)
    else:
        db = mysql_connect.Db()
        email = request.POST.get('email')
        password = request.POST.get('password')
        rg = db.auth(email, password)
        f = Functions()
        all_return = f.check_auth(rg, data)
        data = all_return[1]
        rg = all_return[0]
        if rg:
            request.session['auth'] = True
            return redirect('/books/0')
        return render(request, 'signup.html', context=data)

def addNewBook(request):
    data = {
        'error_name': ['#ddd', 'none'],
        'error_author': ['#ddd', 'none'],
        'error_year': ['#ddd', 'none'],
        'description_error': ['#ddd', 'none'],
        'error_load': 'none',
        'poster': None
    }
    if request.method == 'GET':
        return render(request, 'add_book.html' ,context=data)
    db = mysql_connect.Db()
    name = request.POST.get('name')
    author = request.POST.get('author')
    genre = request.POST.get('genre')
    year = request.POST.get('year_of_publication')
    description = request.POST.get('description')
    poster = request.FILES.get('cover')
    print(request.FILES)
    f = Functions()
    data, erors = f.check_input_errors(name, author, description, year, data)
    if poster:
        data['poster'] = poster.name
        f.save_file(poster)
    if erors:
        db.addBook(name, author, year, genre, description, data['poster'], 0)
    return render(request, 'add_book.html', context=data)

def edit_book(request, id):
    db = mysql_connect.Db()
    all_books = db.getBooks()
    id = [i[0] for i in all_books].index(id)
    curent_book = all_books[id]
    data = {
        'error_name': ['#ddd', 'none'],
        'error_author': ['#ddd', 'none'],
        'error_year': ['#ddd', 'none'],
        'description_error': ['#ddd', 'none'],
        'error_load': 'none',
        'name': curent_book[1],
        'author': curent_book[2],
        'year': curent_book[3],
        'desk': curent_book[5],
        'poster': None
    }
    if request.method == 'GET':
        return render(request, 'edit_book.html' ,context=data)

    name = request.POST.get('name')
    author = request.POST.get('author')
    genre = request.POST.get('genre')
    year = request.POST.get('year_of_publication')
    description = request.POST.get('description')
    poster = request.FILES.get('cover')
    print(request.FILES)
    f = Functions()
    data, erors = f.check_input_errors(name, author, description, year, data)
    if poster:
        data['poster'] = poster.name
        f.save_file(poster)
    if erors:
        db.addBook(name, author, year, genre, description, data['poster'], 0)
    return render(request, 'edit_book.html', context=data)

def book(request, id):
    db = mysql_connect.Db()
    first_id = id
    all_books = db.getBooks()
    id = [i[0] for i in all_books].index(id)
    curent_book = all_books[id]
    data = {
        'id': first_id,
        'name': curent_book[1],
        'autor': curent_book[2],
        'year': curent_book[3],
        'desk': curent_book[5],
        'img': curent_book[6],
        'genre': curent_book[4]
    }
    return render(request, 'book.html', context=data)

def delete_book(request, id):
    data = {
        'id': id
    }
    return render(request, 'delete_book.html', context=data)

def delete(request, id):
    db = mysql_connect.Db()
    db.deleteBook(id)
    return redirect('/')
