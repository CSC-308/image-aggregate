import React, {useState} from 'react'

function SignIn(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    if (formIsValid()) {
      setError('');
    }
  }

  function formIsValid() {
    if (username.length < 1) {
      setError('Please enter a username.');
      return false;
    }

    if (password.length < 1) {
      setError('Please enter a password.');
      return false;
    }

    return true;
  }

  return (
    <div className="SignIn">
      <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input
            type="text"
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>
        <label>
          <p>Password</p>
          <input
            type="password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <div className='SubmitButton'>
          <button type="submit">Sign In</button>
        </div>
        <div className='ErrorText'>
          {error}
        </div>
      </form>
    </div>
  )
}

export default SignIn;
