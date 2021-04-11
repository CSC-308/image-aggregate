import React, { useState } from 'react'
import './Images.css'
import Tags from './Tags'
import Collection from './Collection'
import Collections from './Collections'

function Images(props) {
  {/* To open/close dropdown button
      However, all buttons for images open/close at same time
  */}
  const [open, setOpen] = useState(false);
  async function handleDropdown() {
    setOpen(!open);
  }
  async function handleAddImage() {

  }
  {/* End of addition */}

  const images = props.searchResults.images?.map((image, index) => {
    if (image.pagemap?.cse_image) {
      const url = image.pagemap.cse_image[0].src;
      return (
        <div className='Image'>
          <div className='ImageDiv'>
            <img
              src={url}
              alt={`Search result ${index}`} />
            {/* Dropdown button to create/add to collection */}
            <button type="button" class="AddImage" onClick={handleDropdown}>+</button>
            {open && (
              <div className="Dropdown">
                <ul>
                  {props.session && props.session.collections ? props.session.collections.map(collection => (
                    <button
                      type="button"
                      class="Collection"
                      onClick={handleAddImage}>
                        {collection.name}
                    </button>
                  )) : <p>No collections</p>}
                </ul>
              </div>
            )}
            {/* End of addition */}
          </div>
          <div className='TagsDiv'>
            <Tags className='Tags'
              tagNames={props.searchResults.tagNames}
              url={url} />
          </div>
        </div>
      );
    } else {
      return (<div className="ImageDiv"></div>);
    }
  });

  return images ? images : [];
}

export default Images;