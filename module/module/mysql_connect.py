from django.core.validators import DomainNameValidator
from django.db import connection
from django.contrib.auth.hashers import make_password, check_password


class Db:
    def __init__(self):
        self.cur = connection.cursor()

    def get_users(self):
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
            self.get_users()
            if mail in self.mails:
                self.id = self.mails.index(mail)
                if check_password(password, self.passwords[self.id]):
                    return True
                return ValueError('Password error')
            return ValueError('Email error')
        except Exception as e:
            print('auth', e)
            return False

    def registarion(self, mail, password):
        try:
            self.get_users()
            if mail not in self.mails and len(password) >= 3:
                self.cur.execute(
                    f'''INSERT INTO `users`(`id`, `login`, `password`) VALUES ('{max(self.all_id) + 1}','{mail}','{make_password(password)}')''')
                self.id = int(max(self.all_id) + 1)
                return True
            elif mail not in self.mails:
                return ValueError('Password error')
            return ValueError('Email error')
        except Exception as e:
            print('registarion', e)
            return False

    def getBooks(self):
        try:
            self.cur.execute('''SELECT `id`, `name`, `author`,`year`, `genre`, `description`, `poster`, `page` FROM `books`''')
            content = self.cur.fetchall()
            self.books = [(int(i[0]), i[1], i[2], i[3], self.genreForId(int(i[4])), i[5], i[6], int(i[7])) for i in content]
            return self.books
        except Exception as e:
            print('get books', e)
            return []

    def addBook(self, name, author,year, genre_id: int, description, poster_name, page: int):
        try:
            print(name, author, year, genre_id, description, poster_name, page)
            self.getBooks()
            books = max(self.books, key=lambda x: x[0])
            print(books)
            self.cur.execute(
                f'''INSERT INTO `books`(`id`, `name`, `author`,`year`, `genre`, `description`, `poster`, `page`)
                 VALUES ('{books[0] + 1}','{name}','{author}', '{year}','{genre_id}','{description}','{poster_name}','{page}')''')
            return True
        except Exception as e:
            print('addbook', e)
            return False

    def editBook(self, id: int, name, author, year, genre_id: int, description, poster_name, page: int):
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

    def deleteBook(self, id: int):
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

if __name__ == '__main__':
    db = Db()
    print(db.registarion('m9339323029@gmail.com', '123'))

