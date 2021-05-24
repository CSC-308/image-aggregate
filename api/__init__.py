import json, requests, os, sys, logging

import pymongo

from bson.objectid import ObjectId
from bson.json_util import dumps

from flask import (
    Flask,
    redirect,
    request,
    url_for,
    jsonify,
    session
)
from flask_login import (
    LoginManager,
    current_user,
    login_required,
    login_user,
    logout_user,
)
from flask_cors import CORS

from api.user import User

# Flask app setup.
# Learn more at: https://flask-session.readthedocs.io/en/latest/ (session).
app = Flask(__name__)
app.config.update(
    DEBUG=True,
    SECRET_KEY=os.getenv('APP_SECRET_KEY'),
    SESSION_COOKIE_HTTPONLY=True,
    REMEMBER_COOKIE_HTTPONLY=True,
)

logging.basicConfig(level=logging.DEBUG)

# This import must appear after initialization of Flask app.
import api.google
from api.collection import Collection

# CORS setup.
# Learn more at: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS.
cors = CORS(
    app,
    resources={ r"*": { "origins": os.getenv('ORIGINS') } },
    supports_credentials=True,
)

# User session management setup.
# Learn more at: https://flask-login.readthedocs.io/en/latest
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.session_protection = "strong"

# MongoDB setup.
logging.info("Connecting with %s", os.getenv('MONGO_DB_CONNECTION_STRING'))
db_client = pymongo.MongoClient(os.getenv('MONGO_DB_CONNECTION_STRING'))
db = db_client.get_database('Image_Aggregate')

# Flask-Login helper to retrieve a user from our db.
# Should return None if the user is not found or invalid user_id.
@login_manager.user_loader
def load_user(user_id):
    return User.get(db, user_id)

@app.route('/')
def index():
    return jsonify({"message": "Hello world!"})

@app.route('/user')
def get_current_user():
    if current_user.is_authenticated:
        return jsonify({
            "id": current_user.id,
            "name": current_user.first_name,
            "first_name": current_user.first_name,
            "last_name": current_user.last_name,
            "email": current_user.email,
        })

    return jsonify({})

@login_required
@app.route("/logout")
def logout():
    logout_user()

    return redirect(os.getenv('LOGOUT_REDIRECT'))

# Use this to jsonify database objects
def harsh_jsonify(post_object):
    return jsonify(json.loads(dumps(post_object)))

@app.route('/post/<image_id>')
def get_post(image_id):
    query_object = {'_id': ObjectId(image_id)}
    post = db.Images.find_one(query_object)
    if post is not None:
        logging.info(post)
        return harsh_jsonify(post)
    logging.info("Image_id: %s not found.", image_id)
    return jsonify({})

@app.route('/search/<tag_name>')
def search_by_name(tag_name):
    tag = db['Tags'].find_one({'name': tag_name})
    if tag:
        page = []
        for image_id in tag['images described']:
            page.append(db['Images'].find_one({'_id': image_id}))
        logging.info(page)
        return harsh_jsonify(page)
    logging.info("Tag_name: %s not found.", tag_name)
    return jsonify({})

@app.route('/search/<tag_id>')
def search_by_tag(tag_id):
    tag = db.Tags.find_one({'_id': ObjectId(tag_id)})
    if tag:
        page = []
        for image_id in tag['images described']:
            page.append(db.Images.find_one({'_id': image_id}))
        return harsh_jsonify(page)
    return jsonify({})

# NOTE: Does not work until database structure changes
# @app.route('/vote/<image_id>/<tag_id>')
# def vote(image_id, tag_id):
#     app.logger.info("attempting vote"+
#     " with image_id: "+str(image_id)+
#     " and tag_id: "+str(tag_id))

#     image_id, tag_id = ObjectId(image_id), ObjectId(tag_id)
#     queryObject = {'_id': image_id}

#     post = database['Images'].find_one(queryObject)
#     if post:
#         for tag in post['tags']:
#             if (tag['_id']==tag_id):
#                 tag['votes']+=1
#                 return harsh_jsonify(database['Images'].find_one_and_update(
#                 queryObject, {'$inc': {'tags['+str(tag_id)+']': 1}}))
#     return jsonify({})

@app.route('/user/collections', methods=['GET'])
def get_current_user_collections():
    query = db.Users.find_one({'_id': current_user.id})
    output = {}
    i = 0

    for collection_id in query.collections:
        output[i] = db['Image Collections'].find_one({'_id': collection_id})
        i += 1

    return jsonify(output)

@app.route('/user/collections/<id>', methods=['GET'])
def get_collection(collection_id):
    output = Collection.get(db, collection_id)
    return jsonify(output)
