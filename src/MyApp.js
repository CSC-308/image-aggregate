import React, {useState} from 'react'
import Form from './Form';
import Results from './Results';

function MyApp() {
    const [results, setResults] = useState([]);

    const [companionTags, setTags] = useState({"search": {'g': 0}});
    /*companionTags is a URL dictionary containing tag dictionaries.
    "search" is a special entry for images displayed by Results.js*/

    function updateResults(searchResults) {
        setResults(searchResults);
    }

    //tag interaction functions
    function updateTags(URL, tags){
        let temp = {...companionTags};
        temp[URL] = tags;
        setTags(temp);
    }
    function URLtag(URL){
        return companionTags[URL];
    }

    return (
        <div className="container">
            <Form handleSearch={updateResults} updateSearch={updateTags}/>
            <Results results={results} URLtag={URLtag}/>
        </div>
    )
}

export default MyApp;
