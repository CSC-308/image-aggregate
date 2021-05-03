import requests, json, os

from flask import (
    Flask,
    redirect,
    request,
    session
)
from oauthlib.oauth2 import WebApplicationClient

from api import app, login_user, User

GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
GOOGLE_DISCOVERY_URL = (
    'https://accounts.google.com/.well-known/openid-configuration'
)

# OAuth2 client setup
client = WebApplicationClient(GOOGLE_CLIENT_ID)

def get_google_provider_cfg():
    return requests.get(GOOGLE_DISCOVERY_URL).json()

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
        print("User email not available or not verified by Google.")
        return None

    user_id = userinfo_response.json()["sub"]
    user_name = userinfo_response.json()["given_name"]
    user_email = userinfo_response.json()["email"]
    user_picture = userinfo_response.json()["picture"]

    # If the user is not already in our database, add them.
    if not User.get(user_id):
        User.create(user_id, user_name, user_email, user_picture)

    # Begin user session
    user = User(user_id, user_name, user_email, user_picture)
    login_user(user)

    return redirect(os.getenv('LOGIN_REDIRECT'))
