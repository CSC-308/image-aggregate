import React, {useState} from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import './Login.css'
import SignIn from './SignIn'
import SignUp from './SignUp'
import GoogleLoginButton from './GoogleLoginButton'

function Login(props) {
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div className='Login'>
      <div className='LoginForm'>
        <h1>Log In</h1>
        <div className='GoogleOption'>
          <GoogleLoginButton />
        </div>
        <div className='LoginOptions'>
          <button className='SignInButton'
          onClick={() => setShowSignUp(false)}>
            {'Sign In'}
          </button>
          <button className='SignUpButton'
          onClick={() => setShowSignUp(true)}>
            {'Sign Up'}
          </button>
        </div>
        {showSignUp ? <SignUp /> : <SignIn />}
      </div>
    </div>
  )
}

export default Login;
