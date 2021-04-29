import React, { useState } from 'react'
import './Images.css'
import Tags from './Tags'
import Collection from './Collection'
import Collections from './Collections'

function Images(props) {
  const [open, setOpen] = useState(false);
  async function handleDropdown() {
    setOpen(!open);
  }
  async function handleAddImage() {

  }

  const images = props.searchResults?.images?.map((image, index) => {
    if (image.pagemap?.cse_image) {
      const url = image.pagemap?.cse_image[0]?.src;
      return (
        <div className='Image'>
          <div className='ImageDiv'>
            <button type="button" className="AddImage" onClick={handleDropdown}>+</button>
            {open && (
              <div className="Dropdown">
                <ul>
                  {props.session && props.session?.collections ? props.session.collections.map(collection => (
                    <button
                      key={collection.name}
                      type="button"
                      className="Collection"
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
              tagNames={props.searchResults?.tagNames}
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
