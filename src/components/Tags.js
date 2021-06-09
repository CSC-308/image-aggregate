import React, {useState, useEffect} from 'react'
import Tag from './Tag'

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function Tags(props) {
  const [open, setOpen] = useState(false);
  const [tagName, setTagName] = useState('');
  const [tags, setTags] = useState(
    [ ...new Set(props.postData || props.tagNames)].map((tag, i) => {
      return (
        <Tag key={`${tag.name} ${i} ${props.imageId}`} className='Tag' name={tag.name}
          score={tag.votes}
          imageId={props.imageId}/>
      );
    })
  );

  function handleDropdown() {
    setOpen(!open);
  }

  function handleChange(event) {
    setTagName(event.target.value);
  }

  function submitTag(event){
    if (props.tagNames.includes(tagName)){
      alert("Tag name already exists.")
    }
    else{
      fetch(SERVER_URL + '/vote', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ image_id: props.imageId, tag_strs: [tagName],
          inc: 1})
      })
      .then(response => response.json())
      .then(result => {
        console.log(result);
        if (result.success) {
          setTags([ ...tags, <Tag key={tagName} className='Tag' name={tagName}
          score={1} imageId={props.imageId} voted={true}/>]);
        }
        else{
          alert("Couldn't request vote");
        }
      })
      .catch(err => console.error(err));
    }
  }

  return (
    <div>
      {tags}
      <div className='AddToCollectionDiv'>
        <button
          type="button"
          className="AddImage"
          onClick={handleDropdown}>
          +
        </button>
        {open && (
          <form className="PostForm">
          <input className="PostTextBox"
            type="text" placeholder="Tag Name"
            value={tagName}
            onChange={handleChange} />
          <input className="PostTagButton" alt="" type="button"
            onClick={submitTag} />
          </form>
        )}
      </div>
    </div>


  )
}

export default Tags;
