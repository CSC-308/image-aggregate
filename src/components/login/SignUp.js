import React, {useState} from 'react'

function SignUp(props) {
  const [email, setEmail] = useState('');
  const [firstName, setUserFirstName] = useState('');
  const [lastName, setUserLastName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState('');

  const SERVER_URL = process.env.REACT_APP_SERVER_URL;

  function handleSubmit(event) {
    event.preventDefault();

    if (formIsValid()) {
      createUser();
      window.location=process.env.REACT_APP_CLIENT_URL;
      alert('Account creation successful')
    }
  }

  function formIsValid() {
    if (email.length < 1) {
      alert('Must enter an email.');
      return false;
    }

    if (firstName.length < 1) {
      alert('Must enter first name.');
      return false;
    }

    if (lastName.length < 1) {
      alert('Must enter last name.');
      return false;
    }

    if (password !== passwordVerify) {
      alert('Passwords do not match.');
      return false;
    }

    if (password.length < 8) {
      alert('Password must be at least 8 characters long.');
      return false;
    }

    return true;
  }

  function createUser() {
    if (formIsValid) {
      const newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
      };

      fetch(`${SERVER_URL}/users/new`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(newUser)
      })
        .then(response => response.json())
        .then(result => {
          if (result.name) {
            props.updateSession();
          } else {
            alert("Unable to create user: User already exists");
          }
        })
        .catch(err => console.error(err));
    }
  }

  return (
    <div className="SignUp">
      <form onSubmit={handleSubmit}>
        <label>
          <p>First Name</p>
          <input
            type="text"
            onChange={(event) => setUserFirstName(event.target.value)}
          />
          <div className='Placeholder'>Email</div>
        </label>
        <label>
          <p>Last Name</p>
          <input
            type="text"
            onChange={(event) => setUserLastName(event.target.value)}
          />
        </label>
        <label>
          <p>Email</p>
          <input
            type="email"
            onChange={(event) => setEmail(event.target.value)}
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
          <button type="submit">
          Sign Up</button>
        </div>
      </form>
    </div>
  )
}

export default SignUp;