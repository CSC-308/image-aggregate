import React from 'react'

function Collections(props) {
  const collections = props.session.collections;

  async function handleCreateCollection() {
    
  }

  if (collections)
  {
    return (
      <ul className="Body">
        <button onClick={handleCreateCollection}>Create New Collection</button>
        {collections.map((collection) => (
          <p>{collection.name}</p>
        ))}
      </ul>
    )
  }
      {/*<ul className="Body">
        <button onClick={handleCreateCollection}>Create New Collection</button>
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
  }*/}

  return (
    <div className="Body">
      <button type="button" class="NewCollection" onClick={handleCreateCollection}>Create New Collection</button>
      <p>No collecions exist.</p>
    </div>
  )
}

export default Collections;