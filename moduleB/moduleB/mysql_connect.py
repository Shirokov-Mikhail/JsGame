from django.db import connection
from django.contrib.auth.hashers import make_password, check_password


class Db:
    def __init__(self):
        self.cur = connection.cursor()

    def getUsers(self):
        self.cur.execute(''' SELECT `id`, `login`, `password`, `permissions` FROM `users` ''')
        result = self.cur.fetchall()
        self.users = [i[1] for i in result]
        self.passwords = [i[2] for i in result]
        self.user_id = [i[0] for i in result]
        self.permissions = [i[3] for i in result]

    def auth(self, mail, password):
        try:
            self.getUsers()
            if mail in self.users and check_password(password, self.passwords[self.users.index(mail)]):
                self.id = self.user_id[self.users.index(mail)]
                self.permissions = self.permissions[self.users.index(mail)]
                self.users = mail
                return True
        except Exception:
            return False

    def registration(self, mail, password):
        try:
            self.getUsers()
            if mail not in self.users:
                self.cur.execute(
                    f'''INSERT INTO users (id, login, password, permissions) VALUES ({max(self.user_id) + 1}, "{mail}", 
                            "{make_password(password)}", 0)''')
                self.id = 0
                self.permissions = 0
                self.users = mail
        except Exception:
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

    def getFilms(self):
        try:
            self.cur.execute('SELECT `id`, `name`, `type`, `miniature`, `year`, `genre`, `description` FROM `films`')
            result = self.cur.fetchall()
            self.films = [(i[0], i[1], i[2], i[3], i[4], i[5], i[6]) for i in result]
            return self.films

        except Exception:
            self.films = []
            return []

    def addNewFilm(self, name, type, fone, year, genre_id, desck):
        try:

            self.getFilms()
            self.cur.execute(
                f''' INSERT INTO `films`(`id`, `name`, `type`, `miniature`, `year`, `genre`, `description`) 
                VALUES ({max(self.films, key=lambda x: x[0])[0] + 1},'{name}','{type}','{fone}', {year},{genre_id},'{desck}') ''')
            return True
        except Exception:
            return False

    def editFilms(self, id, name, type_film, miniature, year, genre, description):
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
