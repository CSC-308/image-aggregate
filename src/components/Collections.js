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
      // ToDo: This should be created in the backend instead
      //
      // createNewCollectionInBackend(name);
      // props.updateSession();
      //
      // For now we'll just create a temporary one
      const newCollection = {name: name, images: [], id: '0'};
      setCollections([...collections, newCollection]);
      setCollectionName('');
    } else {
      alert('Invalid collection name');
    }
  }

  function deleteCollection(name) {
  }

  function handleCollectionNameChange(event) {
    setCollectionName(event.target.value);
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
        </div>
      )}
    </div>
  )
}

export default Collections;
