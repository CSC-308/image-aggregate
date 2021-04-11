import React, {useState, useEffect} from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './MyApp.css'
import Header from './components/containers/Header'
import Body from './components/containers/Body'
import Collections from './components/Collections'
import Footer from './components/containers/Footer'

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
          <Route path='/search' render={() => (
            <Body
              searchResults={searchResults}
              session={session} />
          )} />
          <Route path='/collections' render={() => (
            <Collections session={session} />
          )} />
        </Switch>
      </Router>
      <Footer />
    </div>
  )
}

export default MyApp;
