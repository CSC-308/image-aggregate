import json, requests

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

# Connecting to MongoDB
import pymongo, logging
from bson.objectid import ObjectId
from bson.json_util import dumps

client = pymongo.MongoClient("")
db = client.get_database('Image_Aggregate')

# from Garett's code to jsonify db obj
def harsh_jsonify(db_object):
    return jsonify(json.loads(dumps(db_object)))

from api.user import User
from api.collection import Collection

# Flask app setup.
# Learn more at: https://flask-session.readthedocs.io/en/latest/ (session).
app = Flask(__name__)
app.config.update(
    DEBUG=True,
    SECRET_KEY="image_aggregate_secret",
    SESSION_COOKIE_HTTPONLY=True,
    REMEMBER_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
)
logging.basicConfig(level=logging.DEBUG)

# This import must appear after initialization of Flask app.
import api.google

# CORS setup.
# Learn more at: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS.
cors = CORS(
    app,
    resources={ r"*": { "origins": "http://localhost:3000" } },
    supports_credentials=True,
)

# User session management setup.
# Learn more at: https://flask-login.readthedocs.io/en/latest
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.session_protection = "strong"

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

    return redirect('http://localhost:3000/')

@app.route('/user/collections', methods=['GET'])
def get_current_user_collections():
    query = db.Users.find_one({'_id': ObjectId(current_user.id)})
    output = []

    for collectionID in query.collections:
        output.append(db['Image Collections'].find_one({'_id': collectionID}))

    if len(output) > 0:
        return harsh_jsonify(output)

    app.logger.info("User_id: " + current_user.id + " has no collections.")
    return jsonify({})

@app.route('/user/collections/<id>', methods=['GET'])
def get_collection(id):
    output = Collection.get(id)

    if output is not None:
        return harsh_jsonify(output)

    app.logger.info("Collection_id:" + id + " not found in " + "User_id: " + current_user.id + " collections.")
    return jsonify({})
