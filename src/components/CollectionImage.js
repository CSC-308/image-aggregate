import React, { useState } from 'react'
import './CollectionImage.css'

function CollectionImage(props) {
  const [open, setOpen] = useState(false);

  function handleDropdown() {
    setOpen(!open);
  }

  function handleRemove(imageId) {
    handleDropdown();
    props.removeImage(imageId);
  }

  return (
    <div key={props.url} className='CollectionImage'>
      <a target='_blank' rel="noopener noreferrer" href={props.url}><img src={props.url} alt={props.alt} /></a>
      <button className='DropdownButton' onClick={handleDropdown}>
        -
      </button>
      {open && (
        <button
          className='RemoveButton'
          onClick={() => handleRemove(props.imageId)}
        >
          Remove Image
        </button>
      )}
    </div>
  );
}

export default CollectionImage;
