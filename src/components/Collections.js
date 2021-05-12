import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import './Collections.css'
import Collection from './Collection'

function Collections(props) {
  const [collections, setCollections] = useState(
    props.session.collections || []
  );
  const [collectionName, setCollectionName] = useState('');

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
