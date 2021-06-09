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
        <label className="InputText">
          <input
            type="email"
            onChange={(event) => setEmail(event.target.value)}
          />
          <div className='Placeholder'>Email</div>
        </label>
        <label className="InputText">
          <input
            type="text"
            onChange={(event) => setUsername(event.target.value)}
          />
          <div className='Placeholder'>Username</div>
        </label>
        <label className="InputText">
          <input
            type="password"
            onChange={(event) => setPassword(event.target.value)}
          />
          <div className='Placeholder'>Password</div>
        </label>
        <label className="InputText">
          <input
            type="password"
            onChange={(event) => setPasswordVerify(event.target.value)}
          />
          <div className='Placeholder'>Verify Password</div>
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
