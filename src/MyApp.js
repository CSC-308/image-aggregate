import React, {useState, useEffect} from 'react'
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import './MyApp.css'
import Header from './components/containers/Header'
import Body from './components/containers/Body'
import Footer from './components/containers/Footer'
import Collections from './components/Collections'
import Collection from './components/Collection'
import Login from './components/login/Login'

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function MyApp() {
  const [session, setSession] = useState({});
  const [collections, setCollections] = useState([]);
  const [searchResults, setSearchResults] = useState({});
  const [postResults, setPostResults] = useState([]);

  useEffect(fetchSession, []);

  async function fetchSession() {
    fetch(`${SERVER_URL}/user`, { credentials: 'include' })
      .then(response => response.json())
      .then(result => {
        setSession(result)
        fetchCollections();
      })
      .catch(err => console.error(err));
  }

  async function fetchCollections() {
    fetch(`${SERVER_URL}/user/collections`, { credentials: 'include' })
      .then(response => response.json())
      .then(result => setCollections(result))
      .catch(err => console.error(err));
  }

  function addSearchResults(results) {
    setSearchResults({
      images: [...results.images, ...(searchResults.images || [])],
      tagNames: [...results.tagNames, ...(searchResults.tagNames || [])]
    });
  }

  return (
    <div className="MyApp">
      <Router>
        <Header
          session={session}
          updateSession={setSession}
          updateSearchResults={setSearchResults}
          updatePostResults={setPostResults}
        />
        <Switch>
          <Route exact path='/collections'>
            <Collections session={session} updateSession={fetchSession} />
          </Route>
          {collections.map(collection =>
            <Route
              key={collection['_id']['$oid']}
              exact path={`/collections/${collection.name}`}>
              <Collection
                updateSession={fetchSession}
                name={collection.name}
                images={collection.images.map(image => image['$oid'])}
                id={collection['_id']['$oid']}
              />
            </Route>
          )}
          <Route exact path='/login'>
            <Login />
          </Route>
          <Route exact path='/'>
            <Body
              searchResults={searchResults}
              postResults={postResults}
              session={session}
              updateSession={fetchSession}
            />
          </Route>
        </Switch>
        <Footer />
      </Router>
    </div>
  )
}

export default MyApp;
