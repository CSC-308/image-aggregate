import React, {useState, useEffect} from 'react'
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import './MyApp.css'
import Header from './components/containers/Header'
import Body from './components/containers/Body'
import Footer from './components/containers/Footer'
import Collections from './components/Collections'
import Collection from './components/Collection'
import Login from './components/login/Login'

const tempUrl1 = 'https://icatcare.org/app/uploads/2018/07/Helping-your-new-cat-or-kitten-settle-in-1.png';
const tempUrl2 = 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=1.00xw:0.669xh;0,0.190xh&resize=640:*';

function MyApp() {
  const [session, setSession] = useState({});
  const [searchResults, setSearchResults] = useState({});

  useEffect(fetchSession, []);

  function fetchSession() {
    fetch('https://localhost:5000/user', { credentials: 'include' })
      .then(response => response.json())
      // .then(result => setSession(result))
      // Hard code some collections for testing purposes
      // until we have database connected
      .then(result => {
        result.collections = [
          {
            name: 'testCollection1',
            images: [{url: tempUrl1}],
            id: '0'
          },
          {
            name: 'testCollection2',
            images: [{url: tempUrl2}, {url: tempUrl1}],
            id: '1'
          }
        ];
        setSession(result);
      })
      .catch(err => console.error(err));
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
            <Collections session={session} updateSession={fetchSession} />
          </Route>
          {[...session.collections || []].map(collection =>
            <Route
              key={collection.id}
              exact path={`/collections/${collection.name}`}>
              <Collection
                updateSession={fetchSession}
                name={collection.name}
                images={collection.images}
                id={collection.id}
              />
            </Route>
          )}
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
