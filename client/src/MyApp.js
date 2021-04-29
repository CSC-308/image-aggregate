import React, {useState, useEffect} from 'react'
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import './MyApp.css'
import Header from './components/containers/Header'
import Body from './components/containers/Body'
import Footer from './components/containers/Footer'
import Collections from './components/Collections'
import Login from './components/login/Login'

/* Testing travis CI build */
function MyApp() {
  const [session, setSession] = useState({});
  const [searchResults, setSearchResults] = useState({});

  useEffect(fetchSession, []);

  function fetchSession() {
    fetch('https://localhost:5000/user', { credentials: 'include' })
      .then(response => response.json())
      .then(result => setSession(result))
      .catch(err => console.log(err));
  }

  return (
    <div className="MyApp">
      <Router>
        <Header
          session={session}
          updateSession={setSession}
          updateSearchResults={setSearchResults} />
        <Switch>
          <Route exact path='/collections'>
            <Collections session={session} />
          </Route>
          <Route exact path='/login'>
            <Login />
          </Route>
          <Route exact path='/'>
            <Body searchResults={searchResults} />
          </Route>
        </Switch>
        <Footer />
      </Router>
    </div>
  )
}

export default MyApp;
