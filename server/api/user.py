from flask_login import UserMixin

USERS = [] # Temporary "database"

class User(UserMixin):
    def __init__(self, user_id, name, email, picture):
        self.id = user_id
        self.name = name
        self.email = email
        self.picture = picture

    @staticmethod
    def create(user_id, name, email, picture):
        # Add user to our database
        USERS.append(User(user_id, name, email, picture))

        return 0

    @staticmethod
    def get(user_id):
        # Find user in our database
        for user in USERS:
            if user.id == user_id:
                return user

        return None
