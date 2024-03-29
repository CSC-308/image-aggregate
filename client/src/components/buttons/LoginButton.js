import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import styled from 'styled-components'
import standard from '../../themes'

function LoginButton(props) {
  function logout() {
    window.location = 'https://localhost:5000/logout';
  }

  return (
    <div>
      <Link to={props.session.name ? '/' : '/login'}>
        <button className="LoginButton"
          onClick={props.session.name ? logout : null}>
          {props.session.name ? 'Logout' : 'Login'}
        </button>
      </Link>
    </div>
  );
}

export default LoginButton;
