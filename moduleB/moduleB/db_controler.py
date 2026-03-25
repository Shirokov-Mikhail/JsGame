from django.db import connection
from django.contrib.auth.hashers import make_password, check_password


class Db:
    def __init__(self):
        self.cur = connection.cursor()

    def getUser(self):
        self.cur.execute('''SELECT password, login, id, permissions FROM users''')
        rows = self.cur.fetchall()  # Получаем список кортежей
        self.paswords = [row[0] for row in rows]
        self.mail = [row[1] for row in rows]
        self.id_users = [int(row[2]) for row in rows]
        self.permissions = [row[3] for row in rows]

    def auth(self, mail, password):
        self.getUser()
        print(mail, password)
        if mail in self.mail:
            print(True)
            self.permissions = self.permissions[self.mail.index(mail)]
            self.id = self.id_users[self.mail.index(mail)]
            if check_password(password, self.paswords[self.id]):
                return True
        return False

    def registration(self, mail, password):
        self.getUser()
        if not mail in self.mail:
            self.cur.execute(
                f'''INSERT INTO users (id, login, password, permissions) VALUES ({max(self.id_users) + 1}, "{mail}", 
            "{make_password(password)}", 0)''')
            self.id = max(self.id_users) + 1
            return True
        return False

    def getGenreId(self, name):
        self.cur.execute('''SELECT id, genre FROM genre''')
        rows = self.cur.fetchall()  # Получаем список кортежей
        genres = [row[1] for row in rows]
        genres_id = [int(row[0]) for row in rows]
        return genres_id[genres.index(name)]

    def getGenres(self):
        self.cur.execute('''SELECT genre FROM genre''')
        rows = self.cur.fetchall()  # Получаем список кортежей
        genres = [row[0] for row in rows]
        return genres

    def addNewFilms(self, name, type, miniature, year, genre, description):
        try:
            film_id = max(self.getFilms(), key=lambda x: x[0])[0] + 1
            genre = self.getGenreId(genre)

            self.cur.execute(
                f'''INSERT INTO films (id, name, type, miniature, year, genre, description) VALUES ({film_id} ,"{name}",
                 "{type}", "{miniature}", "{year}", "{genre}", "{description}");''')
            return True
        except ValueError:
            return False

    def getFilms(self):
        self.cur.execute('''SELECT id, name, type, miniature, year, genre, description FROM films''')
        rows = self.cur.fetchall()  # Получаем список кортежей
        films = [(int(row[0]), row[1], row[2], row[3], row[4], row[5], row[6]) for row in rows]
        return films

    def editFilm(self, id, name, type_film, miniature, year, genre, description):
        try:
            genre = self.getGenreId(genre)
            if miniature:
                self.cur.execute(
                    f'''UPDATE films SET name="{name}" ,type="{type_film}",miniature="{miniature}", year="{year}",
                    genre="{genre}", description="{description}" WHERE id={int(id)};''')
            else:
                self.cur.execute(
                    f'''UPDATE films SET name="{name}" ,type="{type_film}",miniature="{miniature}", year="{year}",
                                    genre="{genre}" WHERE id={int(id) + 1};''')
            return True
        except Exception as e:
            print(e)
            return False

    def delete_film(self, id):
        try:
            self.cur.execute(
                f'''DELETE FROM `films` WHERE id={id}''')

            return True
        except Exception:
            return False

    def add_favorite_film(self, film_id, user_id):
        try:
            self.cur.execute(f'''INSERT INTO favorite (user_id, films_id) VALUES ({int(user_id)}, {int(film_id)})''')

            return True
        except Exception as e:
            print(e)
            return False

    def delete_favorite_film(self, film_id, user_id):
        try:
            self.cur.execute(f'''DELETE FROM `favorite` WHERE (user_id={user_id}, films_id={film_id})''')

            return True
        except Exception:
            return False

    def get_favorit_films(self, user_id):
        self.cur.execute(f'''SELECT * FROM `favorite` WHERE `user_id`={int(user_id)};''')
        rows = self.cur.fetchall()  # Получаем список кортежей
        films = [i[2] for i in rows]
        return films

    def get_user_id(self):
        return self.id
