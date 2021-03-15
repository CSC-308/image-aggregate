import os
import json

from flask import Flask, redirect, request, url_for, jsonify, session
from flask_login import (
    LoginManager,
    current_user,
    login_required,
    login_user,
    logout_user,
)
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_cors import CORS
from oauthlib.oauth2 import WebApplicationClient
import requests

from user import User

GOOGLE_CLIENT_ID = (
    '64684270017-eos8emv0b652c8gni2uv7s6b5idktrq0.apps.googleusercontent.com'
)
GOOGLE_CLIENT_SECRET = 'UuBVmgkQkHOmBKRWOabgLEB_'
GOOGLE_DISCOVERY_URL = (
    'https://accounts.google.com/.well-known/openid-configuration'
)

# Flask app setup
app = Flask(__name__)
app.config.update(
    DEBUG=True,
    SECRET_KEY="image_aggregate_secret",
    SESSION_COOKIE_HTTPONLY=True,
    REMEMBER_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
)

# CSRF setup
csrf = CSRFProtect(app)

# CORS setup
cors = CORS(
    app,
    resources={r"*": {"origins": "http://localhost:8080"}},
    expose_headers=["Content-Type", "X-CSRFToken"],
    supports_credentials=True,
)

# User session management setup "https://flask-login.readthedocs.io/en/latest"
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.session_protection = "strong"

# OAuth2 client setup
client = WebApplicationClient(GOOGLE_CLIENT_ID)

def get_google_provider_cfg():
    return requests.get(GOOGLE_DISCOVERY_URL).json()

@app.route("/csrf")
def get_csrf():
    token = generate_csrf()
    response = jsonify({"message": "CSRF cookie set"})
    response.headers.set("X-CSRFToken", token)

    return response

# Flask-Login helper to retrieve a user from our db
@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)

@app.route('/')
def index():
    print(current_user)
    if current_user.is_authenticated:
        return jsonify({
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "picture": current_user.picture
        })

    return jsonify({})

@app.route('/google/login')
def google_login():
    # Find out what URL to hit for Google login
    google_provider_cfg = get_google_provider_cfg()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]

    # Use library to construct the request for Google login and provide
    # scopes that let you retrieve user's profile from Google
    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=request.base_url + "/callback",
        scope=["openid", "email", "profile"],
    )

    return redirect(request_uri)

@app.route('/google/login/callback')
def google_login_callback():
    # Get authorization code Google sent back to you.
    code = request.args.get("code")

    # Find out what URL to hit to get tokens that allow you to ask for
    # things on behalf of a user.
    google_provider_cfg = get_google_provider_cfg()
    token_endpoint = google_provider_cfg["token_endpoint"]

    # Prepare and send a request to get tokens.
    token_url, headers, body = client.prepare_token_request(
        token_endpoint,
        authorization_response=request.url,
        redirect_url=request.base_url,
        code=code
    )
    token_response = requests.post(
        token_url,
        headers=headers,
        data=body,
        auth=(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET),
    )

    # Parse the tokens.
    client.parse_request_body_response(json.dumps(token_response.json()))

    # Find and hit the URL from Google that gives you the user's profile
    # information, including their Google profile image and email.
    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = client.add_token(userinfo_endpoint)
    userinfo_response = requests.get(uri, headers=headers, data=body)

    if not userinfo_response.json().get("email_verified"):
        return "User email not available or not verified by Google.", 400

    user_id = userinfo_response.json()["sub"]
    user_name = userinfo_response.json()["given_name"]
    user_email = userinfo_response.json()["email"]
    user_picture = userinfo_response.json()["picture"]

    # If the user is not already in our database, add them.
    if not User.get(user_id):
        User.create(user_id, user_name, user_email, user_picture)

    # Begin user session by logging the user in
    user = User(user_id, user_name, user_email, user_picture)
    login_user(user)

    return redirect('http://localhost:3000/')
    # return redirect(url_for("index"))

@login_required
@app.route("/google/logout")
def logout():
    logout_user()

    return redirect('http://localhost:3000/')
    # return redirect(url_for("index"))

if __name__ == "__main__":
    app.run(ssl_context=('cert.pem', 'key.pem'))
