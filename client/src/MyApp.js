import React, {useState, useEffect} from 'react'
import {Router, Route, browserHistory} from 'react-router'
import './MyApp.css'
import Header from './components/containers/Header'
import Body from './components/containers/Body'
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
      <Header
        session={session}
        updateSession={setSession}
        updateSearchResults={setSearchResults} />
      <Body
        searchResults={searchResults}
        session={session} />
      <Footer />
    </div>
  )
}

export default MyApp;
