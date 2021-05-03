import React from 'react'

function GoogleLoginButton(props) {
  function login() {
    window.location = process.env.REACT_APP_GOOGLE_LOGIN_URL;
  }

  return (
    <button className='GoogleLoginButton'
      onClick={login}>
      {'Continue with Google'}
    </button>
  );
}

export default GoogleLoginButton;
