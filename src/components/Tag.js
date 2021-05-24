import React, {useState} from 'react'

function Tag(props) {
  const [score, setScore] = useState(props.score ? props.score : 0);
  const [voted, setVoted] = useState(false);
  const name = props.name;

  async function handleClick() {
    setScore(score + (voted ? -1 : 1));
    setVoted(!voted);
  }

  return (
    <input className="TagButton" type="button"
      value={`${name} (${score})`}
      onClick={handleClick} />
  );
}

export default Tag;
