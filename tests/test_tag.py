import pytest
import api.tag as Tag
import pymongo
import mongomock
from bson import ObjectId

def mock_db():
    db = mongomock.MongoClient().db
    images = [
        {'image URL': "fakeURL1"},
        {'image URL': "fakeURL2"}
    ]
    tags = [
        {'name': "dog"},
        {'name': "cute"}
    ]

    db['Images'].insert_many(images)
    db['Tags'].insert_many(tags)

    for image in db['Images'].find():
        Tag.image_tag(db, image['_id'], "dog")
        Tag.image_tag(db, image['_id'], "cute")

    return db

def test_conversion():
    db = mock_db()
    tag = db['Tags'].find_one()
    tag_id, name = tag['_id'], tag['name']
    assert(Tag.tag_name_id(db, name)==tag_id)
    assert(Tag.tag_id_name(db, tag_id)==name)

def test_vote_existing():
    db = mock_db()
    assert(db['Images'].find_one()['tags'][0]['votes']==1)

    for image in db['Images'].find():
        Tag.vote(db, image['_id'], "dog")
        Tag.image_tag(db, image['_id'], "cute")

    assert(db['Images'].find_one()['tags'][0]['votes']==2)

def test_vote_pushing():
    db = mock_db()
    assert(len(db['Images'].find_one()['tags'])==2)
    assert(len(db['Tags'].find_one()['images described'])==2)

    posts = db['Images'].find()
    Tag.vote(db, posts[0]['_id'], "extra")
    Tag.vote(db, posts[1]['_id'], "extra")
    extra_tag_id = Tag.tag_name_id(db, "extra")
    assert(extra_tag_id)
    assert(len(db['Tags'].find_one({'name': "extra"})['images described'])==2)

def test_user_image_id():
    db = mock_db()
    assert(Tag.user_image_id(db, db['Images'].find_one()['_id'])!=None)

def test_user_tag_id():
    db = mock_db()
    assert(Tag.user_tag_id(db, db['Tags'].find_one()['_id'])!=None)
