import React from 'react'
import Tag from './Tag'

function Tags(props) {
  console.log(props.postData);
  return [ ...new Set(props.tagNames)].map((tagName, i) =>
    <Tag key={tagName} className='Tag' name={tagName}
      score={props.postData[i] ? props.postData[i].votes : 0}/>
  );
}

export default Tags;
