import React, {useRef} from 'react'
import Tag from './Tag'

function Tags(props) {
    const dictags = props.URLtag(props.URL);
    console.log(dictags);

    let tags = []
    for (let tkey in dictags){
        console.log(tkey);
        tags.push(<Tag name={tkey} score={0}/>);
    }
    return tags;
}

export default Tags;