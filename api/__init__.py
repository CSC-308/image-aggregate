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
    return User.get(user_id)

@app.route('/')
def index():
    return jsonify({"message": "Hello world!"})

@app.route('/user')
def get_current_user():
    print(session)
    if current_user.is_authenticated:
        return jsonify({
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "picture": current_user.picture
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

@app.route('/search/<tag_name>', methods=['GET'])
def search_by_name(tag_name):
    return harsh_jsonify(\
        Tag.user_tag_id(db, Tag.tag_name_id(tag_name), create_new=False)
    )

@app.route('/vote', methods= ['POST'])
def vote():
    if request.method=='POST' and \
    request.form.image_id and request.form.tag_strs:
        for tag_str in request.form.tag_strs:
            Tag.vote(db, ObjectId(request.form.image_id), tag_str)
    return jsonify({})
    

@app.route('/user/collections', methods=['GET'])
def get_current_user_collections():
    query = db.Users.find_one({'_id': current_user.id})
    output = {}
    i = 0

    for collection_id in query.collections:
        output[i] = db['Image Collections'].find_one({'_id': collection_id})
        i += 1

    return jsonify(output)

@app.route('/user/collections/<collection_id>', methods=['GET'])
def get_collection(collection_id):
    output = Collection.get(db, collection_id)
    return jsonify(output)
