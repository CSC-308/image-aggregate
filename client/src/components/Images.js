import React, { useState } from 'react'
import './Images.css'
import Tags from './Tags'
import Collection from './Collection'
import Collections from './Collections'

function Images(props) {
  const [open, setOpen] = useState(false);

  function handleDropdown() {
    setOpen(!open);
  }

  function postFormat(url, collections, index) {
    return (<div className='Image'>
      <div className='ImageDiv'>
        <img src={url} alt={`image ${index}`} />
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
                onClick={handleAddImage}>
                  {collection.name}
              </button>
            ) || <p>No collections</p>}
          </div>
        )}
      </div>
      <div className='TagsDiv'>
        <Tags
          className='Tags'
          tagNames={props.searchResults?.tagNames}
          url={url} />
      </div>
    </div>
    );
  }

  function handleAddImage() {
  }

  console.log(props.searchResults?.images);
  const images = props.searchResults?.images?.map((image, index) => {
    const collections = props.session?.collections;
    if (image.pagemap?.cse_image) {
      const url = image.pagemap?.cse_image[0]?.src;
      return postFormat(url, collections, index);
    } else if (image['image URL']) {
      const url = image['image URL'];
      return postFormat(url, collections, index);
    } else {
      return (
        <div className="Image"></div>
      );
    }
  });

  return images ? images : [];
}

export default Images;
