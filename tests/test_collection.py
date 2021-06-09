import pytest
from api.collection import Collection
import pymongo
import mongomock
from bson import ObjectId

def test_dummy():
    assert(True) is True

def mock_db():
    db = mongomock.MongoClient().db
    collections = [
        {'name': "Collection1",
        'description': "blah",
        'creator': "John",
        'private': False,
        'images': ["image 1", "image 2"]},
        {'name': "Collection2",
        'description': "blah blah",
        'creator': "Ashley",
        'private': False,
        'images': ["image 1", "image 3"]}
    ]

    for coll in collections:
        coll['_id'] = db['Collections'].insert_one(coll).inserted_id

    return db

def test_get_collection():
    db = mock_db()
    collection = {
        'name': "Collection1",
        'description': "blah",
        'creator': "John",
        'private': False,
        'images': ["image 1", "image 2"]
    }

    coll_id = db['Collections'].find_one({'name': "Collection1"})['_id']
    db_collection = Collection.get(db, coll_id)

    assert(collection['name'] == db_collection['name'])

def test_create_collection():
    db = mock_db()
    collection = {
        'name': "Collection3",
        'description': "blah blah blah",
        'creator': "Carl",
        'private': False,
        'images': ["image 3", "image 4"]
    }

    new_user_id = db['Users'].insert_one({'name': "Carl", 'email': "random@gmail.com", 'password': "123", 'collections': []}).inserted_id
    db_collection = Collection.create(db, collection, new_user_id)

    assert(db['Collections'].find_one({'_id': db_collection['_id']})['name'] == db_collection['name'])

def test_delete_collection():
    db = mock_db()
    collection_id = db['Collections'].find_one({'name': "Collection1"})['_id']

    deleted_collection = Collection.delete(db, collection_id)
    assert(deleted_collection.acknowledged is True)
