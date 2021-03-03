import React from 'react'
import Tag from './Tag'

function Tags(props) {
  return [ ...new Set(props.tagNames)].map(tagName =>
    <Tag className='Tag' name={tagName} score={0}/>
  );
}

export default Tags;
