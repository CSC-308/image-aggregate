import React, {useState, useEffect} from 'react'

function Collection(props) {
  const [images, setImages] = useState(props.images);
  const [name, setName] = useState(props.name);
  const id = props.id;

  function removeImage(imageToRemove) {
    // ToDo: This must be reflected in the backend
    //
    // removeImageFromCollectionInBackend(imageToRemove);
    // props.updateSession();
    //
    setImages(images.filter(image => image.url !== imageToRemove.url));
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
        <div key={image.url} className='CollectionImage'>
          <img src={image.url} alt={`image ${index}`} />
        </div>
      )}
    </div>
  )
}

export default Collection;
