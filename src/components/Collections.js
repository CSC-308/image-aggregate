import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import './Collections.css'
import Collection from './Collection'

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function Collections(props) {
  const [collections, setCollections] = useState([]);
  const [collectionName, setCollectionName] = useState('');

  useEffect(fetchCollections, [props.session.collections]);

  async function fetchCollections() {
    if (props.session.collections) {
      fetch(`${SERVER_URL}/user/collections`, { credentials: 'include' })
        .then(response => response.json())
        .then(result => setCollections(result))
        .catch(err => console.error(err));
    }
  }

  function isValidCollectionName(name) {
    return name.length > 0 && !collections.find(collection => {
      return collection.name == name;
    });
  }

  function createNewCollection() {
    const name = collectionName.trim();

    if (isValidCollectionName(name)) {
      const newCollection = {
        name: name,
        description: '',
        creator: `${props.session.first_name} ${props.session.last_name}`,
        private: false
      };

      fetch(`${SERVER_URL}/user/collections`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(newCollection)
      })
        .then(response => response.json())
        .then(result => {
          if (result.name) {
            props.updateSession();
          } else {
            alert("Couldn't add collection");
          }
          setCollectionName('');
        })
        .catch(err => console.error(err));
    } else {
      alert('Invalid collection name');
    }
  }

  function handleCollectionNameChange(event) {
    setCollectionName(event.target.value);
  }

  function deleteCollection(id) {
    fetch(`${SERVER_URL}/user/collections/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          props.updateSession();
        } else {
          alert("Couldn't delete collection");
        }
      })
      .catch(err => console.error(err));
  }

  return (
    <div className='Collections'>
      <form>
        <input className='NewCollectionTextBox'
          type='text'
          value={collectionName}
          onChange={handleCollectionNameChange}
        />
        <input className='NewCollectionButton'
          type='button'
          value='Create New Collection'
          onClick={createNewCollection}
        />
      </form>
      {collections.map(collection =>
        <div key={collection.id} className='CollectionNameDiv'>
          <Link to={`/collections/${collection.name}`}>
            <button className='CollectionNameButton'>
              {collection.name}
            </button>
          </Link>
          <button
            id={collection.id}
            className='CollectionDeleteButton'
            onClick={() => deleteCollection(collection.id)}>
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

export default Collections;
