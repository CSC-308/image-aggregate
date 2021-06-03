import pymongo
from bson.objectid import ObjectId

import logging
logger = logging.getLogger()
logging.basicConfig(level=logging.DEBUG)

# queries a tag name, tries to vote by id, creates a tag if necessary
def vote(db, image_id, tag_str):
    tag_id = tag_name_id(db, tag_str)
    query = {'_id': ObjectId(image_id), 'tags._id': ObjectId(tag_id)}
    newvals = {'$inc': {'tags.$.votes': 1}}
    result = db.Images.update_one(query, newvals)
    if not result.modified_count and db.Images.find_one({'_id': image_id}):
        image_tag(db, image_id, tag_str)

# returns objectID of tag. makes one if necessary if create_new is true.
def tag_name_id(db, tag_str, create_new=True):
    if (tag := db.Tags.find_one({'name': tag_str})):
        return tag['_id']
    if create_new:
        new_tag = {'name': tag_str, 'images described': []}
        return db.Tags.insert_one(new_tag)

# add a tag to an image
def image_tag(db, image_id, tag_str):
    tquery = {'name': tag_str}
    push = {'$push':{'images described': image_id}}
    if (tag_id := db.Tags.update_one(tquery, push)._id):
        query = {'_id': image_id}
        pushvals = {'$push': {'tags': {'_id': tag_id, 'votes': 1} }}
        return db.Images.update_one(query, pushvals)
    return {}

# user functions are safe to deliver to client
def user_image_id(db, image_id):
    return db.Images.find_one({'_id': image_id}, {'user_cat': 0})

def user_tag_id(db, tag_id):
    return db.Images.find({'tags._id': tag_id}, {'user_cat': 0})