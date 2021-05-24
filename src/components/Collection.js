import React, {useState, useEffect} from 'react'

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

  function removeImage(imageToRemove) {
    // ToDo: This must be reflected in the backend
    //
    // removeImageFromCollectionInBackend(imageToRemove);
    // props.updateSession();
    //
    setImages(images.filter(image => image['image URL'] !== imageToRemove['image URL']));
  }

  function addImage(newImage) {
    // ToDo: This must be reflected in the backend
    //
    // addImageToCollectionInBackend(newImage);
    // props.updateSession();
    //
    setImages([...images, newImage]);
  }

  return (
    <div className='Collection'>
      {images.map((image, index) =>
        <div key={image['image URL']} className='CollectionImage'>
          <img src={image['image URL']} alt={`image ${index}`} />
        </div>
      )}
    </div>
  )
}

export default Collection;
