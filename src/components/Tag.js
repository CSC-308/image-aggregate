import React, {useState} from 'react'

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function Tag(props) {
  const [score, setScore] = useState(props.score ? props.score : 0);
  const [voted, setVoted] = useState(props.voted ? props.voted :false);
  const name = props.name;
  const imageId = props.imageId;

  async function handleClick() {
    console.log(SERVER_URL + '/vote');
    fetch(SERVER_URL + '/vote', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ image_id: imageId, tag_strs: [name],
        inc: voted ? -1 : 1})
    })
    .then(response => response.json())
    .then(result => {
      console.log(result);
      if (result.success) {
        setScore(score + (voted ? -1 : 1));
      }
      else{
        alert("Couldn't request vote");
      }
    })
    .catch(err => console.error(err));
    setVoted(!voted);
  }

  return (
    <input className="TagButton" type="button"
      value={`${name} (${score})`}
      onClick={handleClick} />
  );
}

export default Tag;
