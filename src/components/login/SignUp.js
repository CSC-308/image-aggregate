import React, {useState} from 'react'

function SignUp(props) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    if (formIsValid()) {
      setError('');
    }
  }

  function formIsValid() {
    if (email.length < 1) {
      setError('Must enter an email.');
      return false;
    }

    if (username.length < 1) {
      setError('Must enter a username.');
      return false;
    }

    if (password !== passwordVerify) {
      setError('Passwords do not match.');
      return false;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return false;
    }

    return true;
  }

  return (
    <div className="SignUp">
      <form onSubmit={handleSubmit}>
        <label>
          <p>Email</p>
          <input
            type="email"
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
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
        <label>
          <p>Verify Password</p>
          <input
            type="password"
            onChange={(event) => setPasswordVerify(event.target.value)}
          />
        </label>
        <div className='SubmitButton'>
          <button type="submit">Sign Up</button>
        </div>
        <div className='ErrorText'>
          {error}
        </div>
      </form>
    </div>
  )
}

export default SignUp;
