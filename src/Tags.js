import React, {useRef} from 'react'
import Tag from './Tag'

function Tags(props) {
    const dictags = useRef(props.URLtag(props.URL));
    if (dictags.current == {}){
        return (<t>ERR</t>);
    }

    const tags = dictags.current.map(tkey => {
        return (<Tag name={tkey} score={0}/>)
    });
    return tags;
}

export default Tags;