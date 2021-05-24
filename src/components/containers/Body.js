import React from 'react'
import './Body.css'
import Images from '../Images'

function Body(props) {
  return (
    <div className="Body">
      <Images className='Images'
        searchResults={props.searchResults}
        postResults={props.postResults}
        session={props.session}/>
    </div>
  );
}

export default Body;
