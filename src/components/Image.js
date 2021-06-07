import React, { useState, useEffect } from 'react'
import Tags from './Tags'
import Collection from './Collection'
import Collections from './Collections'

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function Image(props) {
  const [open, setOpen] = useState(false);
  const [collections, setCollections] = useState(null);

  useEffect(fetchCollections, []);

  async function fetchCollections() {
    if (props.session?.collections) {
      fetch(`${SERVER_URL}/user/collections`, { credentials: 'include' })
        .then(response => response.json())
        .then(result => setCollections(result.length > 0 ? result : null))
        .catch(err => console.error(err));
    }
  }

  function handleDropdown() {
    setOpen(!open);
  }

  async function addToCollection(collectionId, url) {
    fetch(`${SERVER_URL}/images`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        'image URL': url,
        'tags': [] // This is not correct
      })
    })
      .then(response => response.json())
      .then(result => {
        const fetchUrl = `${SERVER_URL}/user/collections` +
          `/${collectionId}/${result['id']}`;
        fetch(fetchUrl, {
          method: 'POST',
          credentials: 'include'
        })
          .then(response => response.json())
          .then(result => {
            if (result.success) {
              props.updateSession();
            } else {
              alert(result.error);
            }
          })
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  }

  return (
    <div className='Image'>
      <div className='ImageDiv'>
        <img src={props.url} alt={`image ${props.index}`} />
      </div>
      <div className='AddToCollectionDiv'>
        <button
          type="button"
          className="AddImage"
          onClick={handleDropdown}>
          +
        </button>
        {open && (
          <div className="Dropdown">
            {collections?.map(collection =>
              <button
                key={collection.name}
                type="button"
                onClick={() => addToCollection(collection.id, props.url)}>
                  {collection.name}
              </button>
            ) || <p>No collections</p>}
          </div>
        )}
      </div>
      <div className='TagsDiv'>
        <Tags
          className='Tags'
          tagNames={props.tagNames}
          postData={props.tags}
          url={props.url} />
      </div>
    </div>
  );
}

export default Image;
