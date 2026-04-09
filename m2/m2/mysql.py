from django.db import connection
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth.hashers import make_password, check_password

class Db:
    def __init__(self):
        self.cur = connection.cursor()

    def getUsers(self):
        try:
            self.cur.execute('''SELECT `id`, `login`, `password` FROM `users`''')
            content = self.cur.fetchall()
            self.mails = [i[1] for i in content]
            self.passwords = [i[2] for i in content]
            self.all_id = [int(i[0]) for i in content]
            return
        except Exception as e:
            return ValueError(e)

    def auth(self, mail, password):
        try:
            self.getUsers()
            if mail in self.mails:
                if check_password(password, self.passwords[self.mails.index(mail)]):
                    return True
                return 'email'
            return 'password'
        except Exception as e:
            print('auth', e)
            return 'auth'

    def registaration(self, mail, password):
        try:
            self.getUsers()
            if mail not in self.mails:
                if len(password) > 3:
                    self.cur.execute(
                    self.cur.execute(
                        f'''INSERT INTO `users`(`id`, `login`, `password`) VALUES ('{max(self.all_id) + 1}','{mail}','{make_password(password)}')'''))
                    return True
                return 'password'
            return 'email'
        except Exception as e:
            print('auth', e)
            return 'auth'

    def getBooks(self):
        try:
            self.cur.execute(
                '''SELECT `id`, `name`, `author`,`year`, `genre`, `description`, `poster`, `page` FROM `books`''')
            content = self.cur.fetchall()
            self.books = [(int(i[0]), i[1], i[2], i[3], self.genreForId(int(i[4])), i[5], i[6], int(i[7])) for i in
                          content]
            return self.books
        except Exception as e:
            print('get books', e)
            return []

    def addBook(self, name, author, year, genre_id:int, description, poster_name, page:int):
        try:
            self.getBooks()
            books = max(self.books, key=lambda x: x[0])
            self.cur.execute(
                f'''INSERT INTO `books`(`id`, `name`, `author`,`year`, `genre`, `description`, `poster`, `page`)
                        VALUES ('{books[0] + 1}','{name}','{author}', '{year}','{genre_id}','{description}','{poster_name}','{page}')''')
            return True
        except Exception as e:
            print('add', e)
            return False

    def edit_book(self, id: int, name, author, year, genre_id: int, description, poster_name, page: int):
        try:
            if poster_name != '' and poster_name:
                self.cur.execute(f'''UPDATE `books` SET `name`='{name}',`author`='{author}',`genre`='{genre_id}',
            `description`='{description}',`poster`='{poster_name}',`page`='{page}', `year`='{year}' WHERE id='{id}' ''')
            else:
                self.cur.execute(f'''UPDATE `books` SET `name`='{name}',`author`='{author}',`genre`='{genre_id}',
            `description`='{description}',`page`='{page}',`year`='{year}' WHERE id='{id}' ''')
            return True
        except Exception as e:
            print('editbook', e)
            return False

    def delete_book(self, id:int):
        try:
            self.cur.execute(f'''DELETE FROM `books` WHERE id='{id}' ''')
            return True
        except Exception as e:
            print('delete', e)
            return False

    def genreForId(self, id):
        try:
            self.cur.execute('''SELECT `id`, `name` FROM `genre`''')
            result = self.cur.fetchall()
            name = [i[1] for i in result][id]
            return name
        except Exception as e:
            print('genres', e)
            return 'NONE'
