import React, { useState } from 'react'
import './Images.css'
import Image from './Image'
import Tags from './Tags'
import Collection from './Collection'
import Collections from './Collections'

function Images(props) {
  const images = props.searchResults?.images?.map((image, index) => {
    const collections = props.session?.collections;

    if (image.pagemap?.cse_image) {
      const url = image.pagemap?.cse_image[0]?.src;

      return (
        <Image
          session={props.session}
          updateSession={props.updateSession}
          url={url}
          collections={collections}
          tagNames={props.searchResults.tagNames}
          tags={[]}
          imageId={''}
          index={index}
        />
      );
    } else {
      return (
        <div className="Image"></div>
      );
    }
  });

  const posts = props.postResults?.map((post, index) => {
    const collections = props.session?.collections;

    if (post.image_URL) {
      const url = post.image_URL;
      return (
        <Image
          session={props.session}
          updateSession={props.updateSession}
          url={url}
          collections={collections}
          tagNames={post.tags.map((tag) => tag.name)}
          tags={post.tags}
          imageId={post._id}
          index={index}
        />
      );
    } else {
      return (
        <div className="Image"></div>
      );
    }
  });

  return [...posts || [], ...images || []];
}

export default Images;
