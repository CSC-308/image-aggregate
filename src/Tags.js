import React, {useRef} from 'react'
import Tag from './Tag'

function Tags(props) {
    const dictags = props.URLtag(props.URL);
    console.log(dictags);

    let tags = []
    for (let tkey in dictags){
        tags.push(<Tag name={tkey} score={0}/>);
    }
    // const tags = dictags.map(tkey => {
    //     return (<Tag name={tkey} score={0}/>)
    // });
    return tags;
}

export default Tags;