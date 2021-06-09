import pytest
from api import collection, image
from api.image import Image
import pymongo
import mongomock
from bson import ObjectId

def mock_db():
    db = mongomock.MongoClient().db
    images = [
        {'image URL': "image1.png",
        'tags': ["sunny", "bright"]},
        {'image URL': "image2.png",
        'tags': ["dark", "cloudy"]},
        {'image URL': "image3.jpg",
        'tags': ["plane", "travel"]}
    ]

    db['Images'].insert_many(images)

    return db

def test_get_image():
    db = mock_db()
    img_id = db['Images'].find_one({'image URL': "image2.png"})['_id']

    image_retrieved = Image.get(db, img_id)

    assert(image_retrieved['image URL'] == db['Images'].find_one({'image URL': "image2.png"})['image URL'])
    assert(image_retrieved['tags'] == db['Images'].find_one({'image URL': "image2.png"})['tags'])

def test_create_image():
    db = mock_db()
    new_image = {'image URL': "image4.jpg", 'tags': []}

    Image.create(db, new_image)
    assert(db['Images'].find_one({'image URL': new_image['image URL']}) is not None)
