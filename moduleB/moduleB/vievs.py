import os

from django.shortcuts import redirect, render
from django.views.decorators.csrf import ensure_csrf_cookie
from . import mysql_connect, settings

@ensure_csrf_cookie
def index(request):
    if 'auth' not in request.session:
        request.session['auth'] = False
    db = mysql_connect.Db()
    if bool(request.session['auth']):
        data = {
            'email_error': ['white', ''],
            'password_error': ['white', '']}
        if request.method == 'POST':
            mail = request.POST.get('email')
            password = request.POST.get('password')
            if db.auth(mail, password):
                request.session['auth'] = True
                request.session['id'] = db.id
                return redirect('127.0.0.1:5000')
            data['email_error'] = ['red', 'Не правильный Email']
            data['password_error'] = ['red', 'Не правильный Пароль']
        return render(request, 'index.html', context=data)
    else:
        data = {
            'data': db.getFilms(),
        }
        return render(request, 'books.html', context=data)

def add_new_film(request):
    db = mysql_connect.Db()
    if request.method == 'POST':
        name = request.POST.get()
        autor = request.POST.get()
        page = request.POST.get()
        year = request.POST.get()
        genre = request.POST.get()
        desk = request.POST.get()
        fone = request.FILES.get('poster')
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

        db.addNewFilm(name, autor, int(page), fone.name, year, genre, desk)
    return render(request, 'add_book.html')