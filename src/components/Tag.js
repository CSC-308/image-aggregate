import React, {useState} from 'react'

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function Tag(props) {
  const [score, setScore] = useState(props.score ? props.score : 0);
  const [voted, setVoted] = useState(false);
  const name = props.name;
  const imageId = props.imageId;

  async function handleClick() {
    if (!voted){
      vote();
    }
    setVoted(!voted);
  }

  async function vote(){
    console.log(SERVER_URL + '/vote');
    fetch(SERVER_URL + '/vote', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ image_id: imageId, tag_strs: [name] })
    })
    .then(response => response.json())
    .then(result => {
      console.log(result)
      if (result.success) {
        setScore(score + 1)
      }
      else{
        alert("Couldn't request vote");
      }
    })
    .catch(err => console.error(err));
  }

  return (
    <input className="TagButton" type="button"
      value={`${name} (${score})`}
      onClick={handleClick} />
  );
}

export default Tag;
