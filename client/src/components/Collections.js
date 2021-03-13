import React from 'react'
import Collection from './Collection'

function Collections(props)
{
    return (
        <ul>
          {props.session.collections.images.map((image) => (
            <li key={image.url}>
              <img src={image.url} alt="${image.name}" />
            </li>
          ))}
        </ul>
      )
}

export default Collections;