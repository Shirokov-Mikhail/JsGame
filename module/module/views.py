import os
from datetime import date

from django.shortcuts import redirect, render
from django.views.decorators.csrf import ensure_csrf_cookie

from . import mysql_connect, settings

BOOKS_PER_PAGE = 6
MAX_NAME_LENGTH = 100
MAX_AUTHOR_LENGTH = 100
MAX_DESCRIPTION_LENGTH = 500
MIN_BOOK_YEAR = 1800


def _build_auth_context(email_error='', password_error=''):
    return {
        'email_error': ['red', email_error] if email_error else ['#ddd', ''],
        'password_error': ['red', password_error] if password_error else ['#ddd', ''],
    }


def _build_auth_error_context(error):
    message = str(error)
    if message == 'Email error':
        return _build_auth_context(email_error=message)
    return _build_auth_context(password_error=message)


def _build_book_form_context(book=None):
    data = {
        'error_name': ['#ddd', 'none'],
        'error_author': ['#ddd', 'none'],
        'error_year': ['#ddd', 'none'],
        'description_error': ['#ddd', 'none'],
        'error_load': 'none',
    }
    if book:
        data.update({
            'name': book[1],
            'author': book[2],
            'year': book[3],
            'desk': book[5],
        })
    return data


def _validate_book_form(name, author, year_value, description, data):
    is_valid = True
    parsed_year = None
    current_year = date.today().year

    if len(description) > MAX_DESCRIPTION_LENGTH:
        is_valid = False
        data['description_error'] = ['red', 'block']
    if not name or len(name) > MAX_NAME_LENGTH:
        is_valid = False
        data['error_name'] = ['red', 'block']
    if not author or len(author) > MAX_AUTHOR_LENGTH:
        is_valid = False
        data['error_author'] = ['red', 'block']

    try:
        parsed_year = int(year_value)
    except (TypeError, ValueError):
        parsed_year = None

    if parsed_year is None or parsed_year < MIN_BOOK_YEAR or parsed_year > current_year:
        is_valid = False
        data['error_year'] = ['red', 'block']

    return is_valid, parsed_year


def _store_cover_file(poster):
    if not poster:
        return ''

    # Keep uploads in static/uploads so current templates continue to work.
    upload_dir = os.path.join(settings.BASE_DIR, 'module', 'static', 'uploads')
    os.makedirs(upload_dir, exist_ok=True)
    upload_path = os.path.join(upload_dir, poster.name)

    with open(upload_path, 'wb+') as destination:
        for chunk in poster.chunks():
            destination.write(chunk)

    return poster.name


def _apply_book_filters(books, request):
    filtered_books = books

    selected_genre = request.POST.get('search_genre')
    if selected_genre and selected_genre != '-1':
        filtered_books = [book for book in filtered_books if book[4] == selected_genre]

    sort_order = request.POST.get('alpha')
    if sort_order in {'ASC', 'DESC'}:
        reverse_sort = sort_order == 'DESC'
        filtered_books = sorted(
            filtered_books,
            key=lambda book: book[1].casefold(),
            reverse=reverse_sort,
        )

    search_query = request.POST.get('search', '').strip()
    if search_query:
        filtered_books = [book for book in filtered_books if book[1] == search_query]

    return filtered_books


@ensure_csrf_cookie
def index(request):
    request.session.setdefault('auth', False)
    request.session.setdefault('id', -1)

    if request.session['auth']:
        return redirect('/books/0')

    if request.method == 'GET':
        return render(request, 'index.html', context=_build_auth_context())

    db = mysql_connect.Db()
    email = (request.POST.get('email') or '').strip()
    password = request.POST.get('password') or ''
    auth_result = db.auth(email, password)

    if auth_result is True:
        request.session['auth'] = True
        request.session['id'] = db.id
        return redirect('/books/0')

    if isinstance(auth_result, ValueError):
        return render(request, 'index.html', context=_build_auth_error_context(auth_result))

    return render(request, 'index.html', context=_build_auth_context('Mysql error', 'Mysql error'))


@ensure_csrf_cookie
def books(request, page):
    db = mysql_connect.Db()
    page = max(int(page), 0)

    # GET path is optimized: only one page is fetched from DB.
    if request.method != 'POST':
        total_books = db.countBooks()
        max_page = (total_books - 1) // BOOKS_PER_PAGE if total_books else 0
        page = min(page, max_page)

        data = {
            'data': db.getBooksPage(page, BOOKS_PER_PAGE),
            'undo_page': max(page - 1, 0),
            'page': page,
            'next_page': min(page + 1, max_page),
        }
        return render(request, 'books.html', context=data)

    filtered_books = _apply_book_filters(db.getBooks(), request)
    data = {
        'data': filtered_books,
        'undo_page': page,
        'page': page,
        'next_page': page,
    }
    return render(request, 'books.html', context=data)


@ensure_csrf_cookie
def auth(request):
    request.session['auth'] = False
    request.session['id'] = -1
    return redirect('/')


@ensure_csrf_cookie
def registarion(request):
    if request.method == 'GET':
        return render(request, 'signup.html', context=_build_auth_context())

    db = mysql_connect.Db()
    email = (request.POST.get('email') or '').strip()
    password = request.POST.get('password') or ''
    registration_result = db.registarion(email, password)

    if registration_result is True:
        request.session['auth'] = True
        request.session['id'] = db.id
        return redirect('/')

    if isinstance(registration_result, ValueError):
        return render(request, 'signup.html', context=_build_auth_error_context(registration_result))

    return render(request, 'signup.html', context=_build_auth_context('Mysql error', 'Mysql error'))


def addNewBook(request):
    data = _build_book_form_context()

    if request.method == 'GET':
        return render(request, 'add_book.html', context=data)

    db = mysql_connect.Db()
    name = (request.POST.get('name') or '').strip()
    author = (request.POST.get('author') or '').strip()
    genre = request.POST.get('genre') or '-1'
    year_value = request.POST.get('year_of_publication')
    description = (request.POST.get('description') or '').strip()
    poster = request.FILES.get('cover')

    is_valid, parsed_year = _validate_book_form(name, author, year_value, description, data)
    if not poster:
        is_valid = False
        data['error_load'] = 'block'

    poster_name = _store_cover_file(poster)
    if is_valid and db.addBook(name, author, parsed_year, genre, description, poster_name, 0):
        return redirect('/')

    return render(request, 'add_book.html', context=data)


def edit_book(request, id):
    db = mysql_connect.Db()
    current_book = db.getBookById(id)
    if not current_book:
        return redirect('/books/0')

    data = _build_book_form_context(current_book)
    if request.method == 'GET':
        return render(request, 'edit_book.html', context=data)

    name = (request.POST.get('name') or '').strip()
    author = (request.POST.get('author') or '').strip()
    genre = request.POST.get('genre') or '-1'
    year_value = request.POST.get('year_of_publication')
    description = (request.POST.get('description') or '').strip()
    poster = request.FILES.get('cover')

    data.update({'name': name, 'author': author, 'year': year_value, 'desk': description})
    is_valid, parsed_year = _validate_book_form(name, author, year_value, description, data)

    poster_name = ''
    if poster:
        poster_name = _store_cover_file(poster)

    if is_valid and db.editBook(id, name, author, parsed_year, genre, description, poster_name, 0):
        return redirect(f'/book/{id}')

    return render(request, 'edit_book.html', context=data)


def book(request, id):
    db = mysql_connect.Db()
    current_book = db.getBookById(id)
    if not current_book:
        return redirect('/books/0')

    data = {
        'id': id,
        'name': current_book[1],
        'autor': current_book[2],
        'year': current_book[3],
        'desk': current_book[5],
        'img': f'../static/uploads/{current_book[6]}' if current_book[6] else '',
        'genre': current_book[4],
    }
    return render(request, 'book.html', context=data)


def delete_book(request, id):
    data = {'id': id}
    return render(request, 'delete_book.html', context=data)


def delete(request, id):
    db = mysql_connect.Db()
    db.deleteBook(id)
    return redirect('/')
