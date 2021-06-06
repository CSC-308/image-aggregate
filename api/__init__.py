import json, requests, os, sys, logging

import pymongo
from pymongo import collection

from bson.objectid import ObjectId
from bson.json_util import dumps

from flask import (
    Flask,
    redirect,
    request,
    url_for,
    jsonify,
    session,
    make_response
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
from api.collection import Collection
from api.image import Image

import api.tag as Tag

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
db_client = pymongo.MongoClient(os.getenv('MONGO_DB_CONNECTION_STRING'),
            tls=True,
            tlsAllowInvalidCertificates=True)
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
            "collections": current_user.collections,
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

@app.route('/post/<image_id>', methods=['GET'])
def get_post(image_id):
    return harsh_jsonify(\
        Tag.user_image_id(db, ObjectId(image_id))
    )

@app.route('/posts', methods=['POST', 'OPTIONS'])
def get_posts():
    if request.method == 'POST':
        image_ids = request.get_json()['image_ids']
        images = Image.get_images(db, image_ids)
        for image in images:
            image['id'] = str(image['_id'])

        return harsh_jsonify(images)

    resp = make_response()
    resp.headers['Access-Control-Allow-Headers'] = 'content-type'

    return resp

@app.route('/search/<tag_name>', methods=['GET'])
def search_by_name(tag_name):
    return harsh_jsonify(\
        Tag.user_tag_id(db, Tag.tag_name_id(db, tag_name, create_new=False))
    )

@app.route('/vote', methods= ['POST'])
def vote():
    logging.info(request.json)
    if request.method=='POST' and \
    'image_id' in request.json and 'tag_strs' in request.json:
        for tag_str in request.json['tag_strs']:
            Tag.vote(db, ObjectId(request.json['image_id']), tag_str)
        return harsh_jsonify(\
            Tag.user_image_id(db, ObjectId(request.json['image_id']))\
        )
    return jsonify({})


@app.route('/user/collections', methods=['GET', 'POST'])
def get_current_user_collections():
    if request.method == 'GET':
        user = db['Users'].find_one({'_id': ObjectId(current_user.id)})
        output = []

        for collectionID in user['collections']:
            coll = Collection.get(db, collectionID)
            coll['id'] = str(coll['_id'])
            output.append(coll)

        if len(output) > 0:
            logging.info(output)
            return harsh_jsonify(output)

        logging.info("User: %s has no collections.", current_user.first_name)
        return jsonify([])
    elif request.method == 'POST':
        collectionToAdd = request.get_json(force=True)
        newCollection = Collection.create(db, collectionToAdd, ObjectId(current_user.id))

        if newCollection is None:
            logging.info("Collection: %s already exists in User: %s collections.", collectionToAdd['name'], current_user.name)
            return jsonify({}), 404

        logging.info(newCollection)
        return harsh_jsonify(newCollection), 201


@app.route('/user/collections/<collection_id>', methods=['GET', 'DELETE'])
def get_collection(collection_id):
    if request.method == 'GET':
        collection = Collection.get(db, ObjectId(collection_id))

        if collection is not None:
            logging.info(collection)
            return harsh_jsonify(collection)

        logging.info("Collection_id: %s not found in User: %s collections.",
                str(collection_id), current_user.first_name)
        return jsonify({}), 404
    elif request.method == 'DELETE':
        deleted_query = Collection.delete(db, ObjectId(collection_id))
        logging.info(deleted_query)

        if deleted_query.acknowledged is True:
            User.remove_collection(db, current_user.id, collection_id)
            return jsonify({ 'success': True })

        logging.info("Collection_id: %s not found in User: %s collections.",
                str(collection_id), current_user.first_name)
        return jsonify({ 'success': False })

@app.route('/user/collections/<collection_id>/<img_id>', methods=['POST', 'DELETE'])
def update_collection(collection_id, img_id):
    coll = Collection.get(db, ObjectId(collection_id))

    if coll is None:
        logging.info("Collection_id: %s not found in User: %s collections.",
                str(collection_id), current_user.first_name)
        return jsonify({
            'success': False,
            'error': 'Invalid collection id'
        })

    for image_id in coll['images']:
        if img_id == str(image_id):
            if request.method == 'POST':
                logging.info("Image_id: %s already exists in Collection_id: %s.",
                        str(img_id), str(collection_id))
                return jsonify({
                    'success': False,
                    'error': 'Image already exists in collection'
                })
            elif request.method == 'DELETE':
                updated_query = Collection.remove_image(db, ObjectId(collection_id), image_id)
                logging.info(updated_query)
                return jsonify({ 'success': True })

    if request.method == 'POST':
        updated_query = Collection.add_image(db, ObjectId(collection_id), ObjectId(img_id))
        logging.info(updated_query)
        return jsonify({ 'success': True })
    elif request.method == 'DELETE':
        logging.info("Image_id: %s does not exist in Collection_id: %s.",
                str(img_id), str(collection_id))
        return jsonify({
            'success': False,
            'error': 'Image not found in collection'
        })

@app.route('/images', methods=['POST'])
def add_image():
    image_to_add = request.get_json(force=True)
    new_image = Image.create(db, image_to_add)
    new_image['id'] = str(new_image['_id'])

    logging.info(new_image)
    return harsh_jsonify(new_image)
