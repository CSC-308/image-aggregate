import React from 'react'
import './Images.css'
import Tags from './Tags'

function Images(props) {
  const images = props.searchResults.images?.map((image, index) => {
    if (image.pagemap?.cse_image) {
      const url = image.pagemap.cse_image[0].src;
      return (
        <div className='Image'>
          <div className='ImageDiv'>
            <img
              src={url}
              alt={`Search result ${index}`}/>
          </div>
          <div className='TagsDiv'>
            {/* <Tags className='Tags'
              tagNames={props.searchResults.tagNames}
              url={url}/> */}
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
