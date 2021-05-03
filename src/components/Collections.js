import React, {useState, useEffect} from 'react'
import Collection from './Collection'

const temp = 'https://cdn.mos.cms.futurecdn.net/vChK6pTy3vN3KbYZ7UU7k3-1200-80.jpg';

function Collections(props) {
  const [collections, setCollections] = useState([]);
  const [newCollection, setNewCollection] = useState('');

  useEffect(() => setCollections(props.session.collections || []), []);

  function handleCreateCollection() {
    /* Also needs to be reflected in the backend */
    if (newCollection.length > 0 &&
      !collections.find(x => x === newCollection)) {
      setCollections([...collections, newCollection]);
      setNewCollection('');
    }
  }

  function handleChange(event) {
    setNewCollection(event.target.value);
  }

  return (
    <div className='Collections'>
      <form className='AddCollection'>
        <input type='text' value={newCollection} onChange={handleChange} />
        <input type='button' value='Create New Collection' onClick={handleCreateCollection} />
      </form>
      {collections}
    </div>
  )
}

export default Collections;
