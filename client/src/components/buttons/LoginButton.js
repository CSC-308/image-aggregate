import React from 'react'
import styled from 'styled-components'
import standard from '../../themes'

const Button = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solid ${standard.textColor};
  color: ${standard.textColor};
  font-size: 20px;
  cursor: pointer;
  &:hover {
    border: 2px solid ${standard.altText};
    color: ${standard.altText};
  }
`;

function LoginButton(props) {
  function login() {
    window.location = 'https://localhost:5000/google/login';
  }

  function logout() {
    fetch('https://localhost:5000/google/test')
      .then(response => response.json())
      .then(result => props.updateSession(result))
      .catch(err => console.log(err));
  }

  return (
    <Button className="LoginButton"
      onClick={props.session.name ? logout : login}>
      {props.session.name ? 'Logout' : 'Login'}
    </Button>
  );
}

export default LoginButton;
