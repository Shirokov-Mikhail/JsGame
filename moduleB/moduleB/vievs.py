import os

from django.shortcuts import redirect, render
from django.views.decorators.csrf import ensure_csrf_cookie
from . import mysql_connect, settings

@ensure_csrf_cookie
def index(request):
    if 'auth' not in request.session:
        request.session['auth'] = False
    db = mysql_connect.Db()
    if not bool(request.session['auth']):
        data = {
            'email_error': ['gray', ''],
            'password_error': ['gray', '']}
        if request.method == 'POST':
            mail = request.POST.get('email')
            password = request.POST.get('password')
            if db.auth(mail, password):
                request.session['auth'] = True
                request.session['id'] = db.id
                return redirect('http://127.0.0.1:5000/')
            data['email_error'] = ['red', 'Не правильный Email']
            data['password_error'] = ['red', 'Не правильный Пароль']
        return render(request, 'index.html', context=data)
    else:
        data = {
            'data': db.getFilms(),
        }
        print(data)
        return render(request, 'books.html', context=data)

def add_new_film(request):
    db = mysql_connect.Db()
    if request.method == 'POST':
        name = request.POST.get('name')
        autor = request.POST.get('author')
        page = 0
        year = request.POST.get('year_of_publication')
        genre = request.POST.get('genre')
        desk = request.POST.get('description')
        fone = request.FILES.get('cover')

        if fone:
            # 1. Формируем путь (лучше использовать абсолютный через BASE_DIR)
            upload_path = os.path.join(settings.BASE_DIR, 'moduleB/static/uploads/', fone.name)

            # 2. Создаем директорию, если её нет
            os.makedirs(os.path.dirname(upload_path), exist_ok=True)

            # 3. ПРАВИЛЬНО записываем файл
            with open(upload_path, 'wb+') as destination:
                for chunk in fone.chunks():
                    destination.write(chunk)

            # 4. В базу обычно сохраняют ПУТЬ к файлу или только имя
            file_url = f'uploads/{fone.name}'

        if db.addNewFilm(name, autor, int(page), "fone.name", year, genre, desk):
            return render(request, 'add_book.html')
    return render(request, 'add_book.html')

def edit_films(request, id):
    db = mysql_connect.Db()
    id = int(id)
    films = db.getFilms()
    print(films)
    data = {
        'id': id,
        'name': films[id][1],
        'autor': films[id][2],
        'desk': films[id][0],
        'year': films[id][0],
        'genres': [i + ['selected'] if i[0] == films[id][3] else i + [''] for i in db.getGenres()]
    }
    print(data['genres'])
    return render(request, 'edit_book.html', context=data)


def edit_old_book(request):
    db = mysql_connect.Db()
    data = {
        'id': request.POST.get('id'),
        'name': request.POST.get('name'),
        'autor': request.POST.get('autor'),
        'desk': request.POST.get('description'),
        'year': int(request.POST.get('year')),
        'genres': [i + ['selected'] if i[0] == request.POST.get('genres') else i for i in db.getGenres()]
    }
    print(data['genres'])
    fone = request.FILES.get('poster')
    if fone:
        upload_path = os.path.join(settings.BASE_DIR, 'moduleB/static/uploads/', fone.name)

        os.makedirs(os.path.dirname(upload_path), exist_ok=True)

        with open(upload_path, 'wb+') as destination:
            for chunk in fone.chunks():
                destination.write(chunk)

        file_url = f'uploads/{fone.name}'
    if db.editFilms(data['id'], data['name'], 0, fone.name,data['year'], request.POST.get('genres'), data['desk'], data['autor']):
        print(123)
    return render(request, 'edit_book.html', context=data)

def filmRedirect(request):
    return redirect('/add_new_book/')

def auth(request):
    request.session['auth'] = False
    return redirect('http://127.0.0.1:5000/')

def registration(request):
    db = mysql_connect.Db()
    if request.method == "GET":
        data = {
            'email_error': ['white', ''],
            'password_error': ['white', '']}
        if request.method == 'POST':
            mail = request.POST.get('email')
            password = request.POST.get('password')
            if db.auth(mail, password):
                request.session['auth'] = True
                request.session['id'] = db.id
                return redirect('http://127.0.0.1:5000/')
            data['email_error'] = ['red', 'Не правильный Email']
            data['password_error'] = ['red', 'Не правильный Пароль']
        return render(request, 'signup.html', context=data)
    else:
        pass

def delete_book(request, id):
    id = int(id)
    db = mysql_connect.Db()
    if db.delete_film(id) and bool(request.session['auth']):
        return redirect('http://127.0.0.1:5000/')
    return redirect('/error/403')

def book(request, id):
    id = int(id)
    db = mysql_connect.Db()
    books = db.getFilms()
    book = []
    for i in range(len(books)):
        if books[i][0] == id:
            book = books[i]
            break
    genre = db.getGenreId(id)
    print(book)
    data = {
        'autor': book[2],
        'genre': genre,
        'year': book[4],
        'desk': book[5],
        'name': book[1],
        'img': book[6],
        'id': id
    }
    return render(request, 'book.html', context=data)


