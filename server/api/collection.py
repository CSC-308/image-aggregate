from flask_login import (login_required, current_user,)
import pymongo
from bson.objectid import ObjectId

client = pymongo.MongoClient("")
db = client.get_database("Image_Aggregate")

class Collection():

    def __init__(self, collection_id, name, description, creator, private):
        self.id = collection_id
        self.name = name
        self.description = description
        self.creator = creator
        self.private = private
        self.images = []

    @staticmethod
    def create(collection_id, name, description, creator, private):
        queryObject = {
            '_id': ObjectId(collection_id),
            'name': name,
            'description': description,
            'creator': creator,
            'private': private,
            'images': []
        }

        db['Image Collections'].insert__one(queryObject)
        db.Users.update({'_id': current_user.id}, {'$push': {'collections': ObjectId(collection_id)}})

        return 0

    @staticmethod
    def get(collection_id):
        return db['Image Collections'].find_one({'_id': ObjectId(collection_id)})

    @staticmethod
    def addImage(collection_id, img_id):
        db['Image Collections'].update({'_id': ObjectId(collection_id)}, {'$push': {'images': ObjectId(img_id)}})
        return 0

    @staticmethod
    def removeImage(collection_id, img_id):
        db['Image Collections'].update({'_id': ObjectId(collection_id)}, {'$pull': {'images': ObjectId(img_id)}})
        return 0
        