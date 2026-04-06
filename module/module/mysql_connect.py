from django.contrib.auth.hashers import check_password, make_password
from django.db import connection


class Db:
    def __init__(self):
        self.cur = connection.cursor()
        self.id = None

    def _next_user_id(self):
        self.cur.execute("SELECT COALESCE(MAX(`id`), -1) + 1 FROM `users`")
        return int(self.cur.fetchone()[0])

    def _next_book_id(self):
        self.cur.execute("SELECT COALESCE(MAX(`id`), -1) + 1 FROM `books`")
        return int(self.cur.fetchone()[0])

    @staticmethod
    def _normalize_books(rows):
        # Normalize DB rows to the tuple shape used by the templates.
        return [
            (
                int(row[0]),
                row[1],
                row[2],
                int(row[3]),
                row[4] or 'NONE',
                row[5],
                row[6],
                int(row[7]),
            )
            for row in rows
        ]

    def auth(self, mail, password):
        try:
            self.cur.execute(
                "SELECT `id`, `password` FROM `users` WHERE `login`=%s LIMIT 1",
                [mail],
            )
            user = self.cur.fetchone()
            if not user:
                return ValueError('Email error')

            user_id, saved_password = int(user[0]), user[1]
            # Keep backward compatibility with both hashed and plaintext passwords.
            if check_password(password, saved_password) or saved_password == password:
                self.id = user_id
                return True

            return ValueError('Password error')
        except Exception as e:
            print('auth', e)
            return False

    def registarion(self, mail, password):
        try:
            self.cur.execute("SELECT 1 FROM `users` WHERE `login`=%s LIMIT 1", [mail])
            if self.cur.fetchone():
                return ValueError('Email error')

            if len(password) < 3:
                return ValueError('Password error')

            new_id = self._next_user_id()
            self.cur.execute(
                "INSERT INTO `users` (`id`, `login`, `password`) VALUES (%s, %s, %s)",
                [new_id, mail, make_password(password)],
            )
            self.id = new_id
            return True
        except Exception as e:
            print('registarion', e)
            return False

    def countBooks(self):
        try:
            self.cur.execute("SELECT COUNT(*) FROM `books`")
            return int(self.cur.fetchone()[0])
        except Exception as e:
            print('count books', e)
            return 0

    def getBooks(self):
        try:
            self.cur.execute(
                """
                SELECT
                    b.`id`,
                    b.`name`,
                    b.`author`,
                    b.`year`,
                    g.`name`,
                    b.`description`,
                    b.`poster`,
                    b.`page`
                FROM `books` AS b
                LEFT JOIN `genre` AS g ON g.`id` = b.`genre`
                ORDER BY b.`id`
                """
            )
            return self._normalize_books(self.cur.fetchall())
        except Exception as e:
            print('get books', e)
            return []

    def getBooksPage(self, page: int, page_size: int):
        try:
            offset = max(page, 0) * page_size
            self.cur.execute(
                """
                SELECT
                    b.`id`,
                    b.`name`,
                    b.`author`,
                    b.`year`,
                    g.`name`,
                    b.`description`,
                    b.`poster`,
                    b.`page`
                FROM `books` AS b
                LEFT JOIN `genre` AS g ON g.`id` = b.`genre`
                ORDER BY b.`id`
                LIMIT %s OFFSET %s
                """,
                [page_size, offset],
            )
            return self._normalize_books(self.cur.fetchall())
        except Exception as e:
            print('get books page', e)
            return []

    def getBookById(self, book_id: int):
        try:
            self.cur.execute(
                """
                SELECT
                    b.`id`,
                    b.`name`,
                    b.`author`,
                    b.`year`,
                    g.`name`,
                    b.`description`,
                    b.`poster`,
                    b.`page`
                FROM `books` AS b
                LEFT JOIN `genre` AS g ON g.`id` = b.`genre`
                WHERE b.`id` = %s
                LIMIT 1
                """,
                [book_id],
            )
            row = self.cur.fetchone()
            if not row:
                return None
            return self._normalize_books([row])[0]
        except Exception as e:
            print('get book by id', e)
            return None

    def addBook(self, name, author, year, genre_id: int, description, poster_name, page: int):
        try:
            new_id = self._next_book_id()
            self.cur.execute(
                """
                INSERT INTO `books` (`id`, `name`, `author`, `year`, `genre`, `description`, `poster`, `page`)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """,
                [new_id, name, author, year, genre_id, description, poster_name, page],
            )
            return True
        except Exception as e:
            print('addbook', e)
            return False

    def editBook(self, id: int, name, author, year, genre_id: int, description, poster_name, page: int):
        try:
            if poster_name != '':
                self.cur.execute(
                    """
                    UPDATE `books`
                    SET `name`=%s, `author`=%s, `genre`=%s, `description`=%s, `poster`=%s, `page`=%s, `year`=%s
                    WHERE `id`=%s
                    """,
                    [name, author, genre_id, description, poster_name, page, year, id],
                )
                return True

            self.cur.execute(
                """
                UPDATE `books`
                SET `name`=%s, `author`=%s, `genre`=%s, `description`=%s, `page`=%s, `year`=%s
                WHERE `id`=%s
                """,
                [name, author, genre_id, description, page, year, id],
            )
            return True
        except Exception as e:
            print('editbook', e)
            return False

    def deleteBook(self, id: int):
        try:
            self.cur.execute("DELETE FROM `books` WHERE `id`=%s", [id])
            return True
        except Exception as e:
            print('delete', e)
            return False


if __name__ == '__main__':
    db = Db()
    print(db.registarion('m9339323029@gmail.com', '123'))
