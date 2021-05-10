from flask_login import login_required
import pymongo
from bson.objectid import ObjectId

client = pymongo.MongoClient("")
db = client.get_database("Image_Aggregate")

class Image():
    def __init__(self, image_id, image_url, tags):
        self.id = image_id
        self.url = image_url
        self.tags = tags

    @staticmethod
    def create(image_id, image_url, tags):
        queryObject = {
            '_id': ObjectId(image_id),
            'image URL': image_url,
            'tags': tags
        }

        db.Images.insert_one(queryObject)
        return 0
        