import React from 'react'
import styled from 'styled-components'
import standard from '../../themes'



function LoginButton(props) {
  function login() {
    window.location = 'https://localhost:5000/google/login';
  }

  function logout() {
    window.location = 'https://localhost:5000/logout';
  }

  return (
    <button className="LoginButton"
      onClick={props.session.name ? logout : login}>
      {props.session.name ? 'Logout' : 'Login'}
    </button>
  );
}

export default LoginButton;
