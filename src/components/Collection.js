import React, {useState, useEffect} from 'react'
import CollectionImage from './CollectionImage'
import './Collection.css'

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function Collection(props) {
  const [images, setImages] = useState([]);
  const [name, setName] = useState(props.name);
  const id = props.id;

  useEffect(fetchImages, [props.images]);

  async function fetchImages() {
    fetch(`${SERVER_URL}/posts`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image_ids: props.images })
    })
      .then(response => response.json())
      .then(result => setImages(result))
      .catch(err => console.error(err));
  }

  function removeImage(imageId) {
    fetch(`${SERVER_URL}/user/collections/${id}/${imageId}`, {
      method: 'DELETE',
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
  }

  return (
    <div className='Collection'>
      {images.map((image, index) =>
        <CollectionImage
          key={image['image URL']}
          url={image['image URL']}
          alt={`image ${index}`}
          imageId={image['id']}
          removeImage={removeImage}
        />
      )}
    </div>
  )
}

export default Collection;
