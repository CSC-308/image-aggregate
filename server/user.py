from flask_login import UserMixin

USERS = []

class User(UserMixin):
    def __init__(self, user_id, name, email, picture):
        self.id = user_id
        self.name = name
        self.email = email
        self.picture = picture

    @staticmethod
    def create(user_id, name, email, picture):
        if User.get(user_id) is None:
            USERS.append(User(user_id, name, email, picture))

    @staticmethod
    def get(user_id):
        for user in USERS:
            if user.id == user_id:
                return user

        return None
