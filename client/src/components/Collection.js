import React, {useState} from 'react'

function Collection(props) {
  const [images, setImages] = useState([]);
  const [name, setName] = useState(props.name);
  const id = props.id;

  async function removeImage(imageToRemove) {
    setImages(images.filter(image => image.url !== imageToRemove.url));
  }

  async function addImage(newImage) {
    setImages([...images, newImage]);
  }

  return (
    <ul>
      {images.map((image) => (
        <li key={image.url}>
          <img src={image.url} alt="${image.name}" />
        </li>
      ))}
    </ul>
  )
}
