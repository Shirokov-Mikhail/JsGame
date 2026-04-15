from django.db import connection
from django.contrib.auth.hashers import make_password, check_password
from django.template.defaulttags import comment


class Db:
    def __init__(self):
        self.cur = connection.cursor()
        self.per = 0

    def getUsers(self):
        try:
            self.cur.execute('SELECT * FROM `users`')
            result = self.cur.fetchall()
            self.all_id = [int(i[0]) for i in result]
            self.names = [i[1] for i in result]
            self.logins = [i[2] for i in result]
            self.all_passwords = [i[3] for i in result]
            self.all_perm = [int(i[4]) for i in result]
        except Exception as e:
            print(e)

    def auth(self, login, password):
        self.getUsers()
        if login in self.logins:
            if check_password(password, self.all_passwords[self.logins.index(login)]):
                self.per = self.all_perm[self.logins.index(login)]
                return True
            return 'Не правильный пароль'
        return 'Не правильный логин'

    def registration(self, name, login, password):
        self.getUsers()
        if login not in self.logins and len(login) >= 5 and len(name) >= 10:
            self.cur.execute('SELECT MAX(id) FROM users;')

            max_id = int([int(i[0]) for i in self.cur.fetchall()][0]) + 1
            self.cur.execute(f''' INSERT INTO `users`(`id`, `name`, `login`, `password`, `permissions`) 
            VALUES ('{max_id}','{name}','{login}','{make_password(password)}','0') ''')
            self.per = 0
            return True
        return 'Ошибка'

    def statusCode(self, status_name):
        self.cur.execute(f''' SELECT `status-code` FROM `traditional-codes` WHERE `status_text`='{status_name}' ''')
        result = [i[0] for i in self.cur.fetchall()][0]
        return result

    def statusDecode(self, status_id):
        self.cur.execute(f''' SELECT `status_text`, `status-coment` FROM `traditional-codes` WHERE `id`='{status_id}' ''')
        text = [i[0] for i in self.cur.fetchall()][0]
        comment = [i[1] for i in self.cur.fetchall()][0]
        return [text, comment]

    def getTraditions(self):
        self.cur.execute('SELECT * FROM `traditionals`')
        result = self.cur.fetchall()
        result = [(int(i[0]), i[1], i[2], int(i[3]), i[4], i[5], i[6], i[7]) for i in result]
        # id 0, name 1, nation 2, status id 3, main-poster 4, desk poster 5, deskription 6, autor 7
        return result

    def addTradition(self, name, nationality, status_id, main_poster, desk_poster, desk, author):
        self.cur.execute('SELECT MAX(id) FROM `traditionals`')
        max_id = int([int(i[0]) for i in self.cur.fetchall()][0]) + 1
        self.cur.execute(f'''INSERT INTO `traditionals`(`id`, `name`, `nationality`, `status_id`, `main-poster`, 
        `desck-poster`, `deskription`, `autor`) VALUES ('{max_id}','{name}','{nationality}','{status_id}','{main_poster}','{desk_poster}, {desk}, {author}') ''')