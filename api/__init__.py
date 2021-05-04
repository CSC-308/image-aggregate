import json, requests, os

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
    SESSION_COOKIE_SAMESITE="Lax",
)

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

# Flask-Login helper to retrieve a user from our db.
# Should return None if the user is not found or invalid user_id.
@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)

@app.route('/')
def index():
    print(session)
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
