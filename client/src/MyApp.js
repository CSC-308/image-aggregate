import React, { useState, useEffect } from 'react'
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

  async function fetchSession() {
    fetch('https://localhost:5000/')
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
          <Route path="/" exact component={Home} />
          <Route path="/search" render={() => (
            <Body
              searchResults={searchResults}
              session={session} />
          )}
          />
          <Route path="/collections" render={() => (
            <Collections session={session} />
          )}
          />
        </Switch>
      </Router>

      <Footer />
    </div>
  )
}

const Home = () => (
  <div className="Body">
    <h1>Home Page</h1>
  </div>
)

export default MyApp;
