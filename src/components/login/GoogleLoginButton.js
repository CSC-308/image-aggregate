import React from 'react'

function GoogleLoginButton(props) {
  function login() {
    window.location = 'https://localhost:5000/google/login';
  }

  return (
    <button className='GoogleLoginButton'
      onClick={login}>
      {'Continue with Google'}
    </button>
  );
}

export default GoogleLoginButton;
