import React, {useState, useEffect} from 'react'
import './MyApp.css'
import Header from './components/containers/Header'
import Body from './components/containers/Body'
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
      <Header
        session={session}
        updateSession={setSession}
        updateSearchResults={setSearchResults} />
      <Body searchResults={searchResults} />
      <Footer />
    </div>
  )
}

export default MyApp;