from flask_login import UserMixin
from bson.objectid import ObjectId

class User(UserMixin):
    def __init__(self, user_id, first_name, last_name, email, password, collections):
        self.id = str(user_id)
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.password = password
        self.collections = [str(collection) for collection in collections]

    @staticmethod
    def create(db, first_name, last_name, email, password):
        user_id = db.Users.insert({
            'first name': first_name,
            'last name': last_name,
            'email': email,
            'password': password,
            'collections': []
        })

        return User.get(db, user_id)

    @staticmethod
    def get(db, user_id):
        user = db.Users.find_one({ '_id': ObjectId(user_id) })

        if user is not None:
            return User(user['_id'], user['first name'], user['last name'],
                    user['email'], user['password'], user['collections'])

        return None

    @staticmethod
    def find(db, email):
        user = db.Users.find_one({'email': email})

        if user is not None:
            return User.get(db, user['_id'])

        return None
