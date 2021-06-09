import pytest
from api import collection, image
from api.collection import Collection
import pymongo
import mongomock
from bson import ObjectId

def mock_db():
    db = mongomock.MongoClient().db
    collections = [
        {'name': "Collection1",
        'description': "blah",
        'creator': "John",
        'private': False,
        'images': ["01", "02"]},
        {'name': "Collection2",
        'description': "blah blah",
        'creator': "Ashley",
        'private': False,
        'images': ["01", "03"]}
    ]

    for coll in collections:
        coll['_id'] = db['Image Collections'].insert_one(coll).inserted_id

    return db

def test_get_collection():
    db = mock_db()
    collection = {
        'name': "Collection1",
        'description': "blah",
        'creator': "John",
        'private': False,
        'images': ["01", "02"]
    }

    coll_id = db['Image Collections'].find_one({'name': "Collection1"})['_id']
    db_collection = Collection.get(db, coll_id)

    assert(collection['name'] == db_collection['name'])
    assert(collection['description'] == db_collection['description'])
    assert(collection['creator'] == db_collection['creator'])
    assert(collection['private'] == db_collection['private'])
    assert(collection['images'] == db_collection['images'])

def test_create_collection():
    db = mock_db()
    collection = {
        'name': "Collection3",
        'description': "blah blah blah",
        'creator': "Carl",
        'private': False,
        'images': ["03", "04"]
    }

    new_user_id = db['Users'].insert_one({'name': "Carl", 'email': "random@gmail.com", 'password': "123", 'collections': []}).inserted_id
    collection_id = Collection.create(db, collection, new_user_id)['_id']

    assert(db['Image Collections'].find_one({'name': collection['name']}) is not None)
    assert(collection_id in db['Users'].find_one({'name': "Carl"})['collections'])

def test_delete_collection():
    db = mock_db()
    collection_id = db['Image Collections'].find_one({'name': "Collection1"})['_id']

    deleted_collection = Collection.delete(db, collection_id)
    assert(deleted_collection.acknowledged is True)

def test_add_image_to_collection():
    db = mock_db()
    collection_id = db['Image Collections'].find_one({'name': "Collection2"})['_id']
    new_image_id = db['Images'].insert_one({'url': "image10.png"}).inserted_id

    Collection.add_image(db, collection_id, new_image_id)
    assert(new_image_id in db['Image Collections'].find_one({'name': "Collection2"})['images'])

def test_remove_image_from_collection():
    db = mock_db()
    collection_id = db['Image Collections'].find_one({'name': "Collection2"})['_id']
    image_id = "03"

    Collection.remove_image(db, collection_id, image_id)
    assert(image_id not in db['Image Collections'].find_one({'name': "Collection2"}))
