import React from 'react'
import Collection from './Collection'

function Collections(props) {
  const collections = props.collections;

  if (collections)
  {
    return (
      <ul className="Body">
        {collections.map((collection) =>
          collection.images.map((image) => (
            <div className="Collection">
              <li key={image.url}>
                <img src={image.url} alt="${image.name}" />
              </li>
            </div>
          )))}
      </ul>
    )
  }

  return (
    <div>
      <p>No collecions exist.</p>
    </div>
  )
}

export default Collections;