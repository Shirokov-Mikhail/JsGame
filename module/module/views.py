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
                    return redirect('/books/0')
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
        return redirect('/books/0')

@ensure_csrf_cookie
def books(request, page):
    page = int(page)
    db = mysql_connect.Db()
    books = db.getBooks()
    data = {'data': books[page * 6: page * 6 + 6],
            'undo_page': page - 1,
            'page': page,
            'next_page': page + 1
            }
    if len(books) < 6:
        data['next_page'] = page
        data['undo_page'] = page
    elif page == 0:
        data['undo_page'] = page
    elif len(books) - 6 * page < 6:
        data['next_page'] = page
        
    return render(request, 'books.html', context=data)

@ensure_csrf_cookie
def auth(request):
    request.session['auth'] = False
    return redirect('/')

@ensure_csrf_cookie
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

def addNewBook(request):
    data = {
        'error_name': ['gray', 'none'],
        'error_author': ['gray', 'none'],
        'error_year': ['gray', 'none'],
        'description_error': ['gray', 'none'],
        'error_load': 'none'
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
    error = False
    print(request.FILES)
    if poster:
        # 1. Формируем путь (лучше использовать абсолютный через BASE_DIR)
        upload_path = os.path.join(settings.BASE_DIR, 'module/static/uploads/', poster.name)

        # 2. Создаем директорию, если её нет
        os.makedirs(os.path.dirname(upload_path), exist_ok=True)

        # 3. ПРАВИЛЬНО записываем файл
        with open(upload_path, 'wb+') as destination:
            for chunk in poster.chunks():
                destination.write(chunk)

        # 4. В базу обычно сохраняют ПУТЬ к файлу или только имя
        file_url = f'uploads/{poster.name}'
    if len(description) > 500:
        error = True
        data['description_error'] = ['red', 'block']
    if len(name) > 100:
        error = True
        data['error_name'] = ['red', 'block']
    if len(author) > 100:
        error = True
        data['error_author'] = ['red', 'block']
    if int(year) < 1800 or int(year) > 2026:
        error = True
        data['error_year'] = ['red', 'block']
    if not error and db.addBook(name, author, year, genre, description, poster.name, 0):
        return redirect('/')
    return render(request, 'add_book.html', context=data)

def edit_book(request, id):
    db = mysql_connect.Db()
    all_books = db.getBooks()
    id = [i[0] for i in all_books].index(id)
    curent_book = all_books[id]
    data = {
        'error_name': ['gray', 'none'],
        'error_author': ['gray', 'none'],
        'error_year': ['gray', 'none'],
        'description_error': ['gray', 'none'],
        'error_load': 'none',
        'name': curent_book[1],
        'author': curent_book[2],
        'year': curent_book[3],
        'desk': curent_book[5]
    }
    print(request.method)
    if request.method == 'GET':
        return render(request, 'edit_book.html' ,context=data)

    name = request.POST.get('name')
    author = request.POST.get('author')
    genre = request.POST.get('genre')
    year = request.POST.get('year_of_publication')
    description = request.POST.get('description')
    poster = request.FILES.get('cover')
    error = False
    print(request.FILES)
    if poster:
        # 1. Формируем путь (лучше использовать абсолютный через BASE_DIR)
        upload_path = os.path.join(settings.BASE_DIR, 'module/static/uploads/', poster.name)

        # 2. Создаем директорию, если её нет
        os.makedirs(os.path.dirname(upload_path), exist_ok=True)

        # 3. ПРАВИЛЬНО записываем файл
        with open(upload_path, 'wb+') as destination:
            for chunk in poster.chunks():
                destination.write(chunk)

        # 4. В базу обычно сохраняют ПУТЬ к файлу или только имя
        file_url = f'uploads/{poster.name}'
    else:
        poster = ''
    if len(description) > 500:
        error = True
        data['description_error'] = ['red', 'block']
    if len(name) > 100:
        error = True
        data['error_name'] = ['red', 'block']
    if len(author) > 100:
        error = True
        data['error_author'] = ['red', 'block']
    if int(year) < 1800 or int(year) > 2026:
        error = True
        data['error_year'] = ['red', 'block']
    if not error and poster != '' and db.editBook(id, name, author, year, genre, description, poster.name, 0):
        print('DA')
    elif not error and db.editBook(id, name, author, year, genre, description, '', 0):
        print('NET')

    return render(request, 'edit_book.html', context=data)

def book(request, id):
    pass