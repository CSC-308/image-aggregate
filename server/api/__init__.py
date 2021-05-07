import json, requests

from flask import (
    Flask,
    redirect,
    request,
    url_for,
    jsonify,
    session
)

import pymongo, sys, logging
from bson.objectid import ObjectId
from bson.json_util import dumps

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
    resources={ r"*": { "origins": "*" } },
    supports_credentials=True,
)

# mongodb setup
database = None
try:
    with open("./api/config.json","r") as c_file:
        connection_url = json.load(c_file)["ATLAS_URL"]
        app.logger.info("connecting with "+connection_url)
        database = pymongo.MongoClient(connection_url).Image_Aggregate
except Exception as error:
    print(error,sys.stderr)
    print("malformed or missing config.json",sys.stderr)

def harsh_jsonify(post_object):
    return jsonify(json.loads(dumps(post_object)))

@app.route('/post/<image_id>')
def get_post(image_id):
    queryObject = {'_id': ObjectId(image_id)}
    post = database.Images.find_one(queryObject)
    if (post != None):
        app.logger.info(post)
        return harsh_jsonify(post)
    return jsonify({})

# @app.route('/vote', ['POST'])
# def vote():
#     images = database['Images']
#     tags = database['Tags']

#     app.logger.info("attempting vote for user_id: "+current_user.id+
#         " with image_id: "+str(image_id)+
#         " and tag_id: "+str(tag_id))
#     post = images.find_one(image_id)
#     if tag_id in tags:
#

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
