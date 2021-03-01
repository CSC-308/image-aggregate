import React, {useState} from 'react'
import Form from './Form';
import Results from './Results';

function MyApp() {
    const [results, setResults] = useState([]);
    const [searchTags, setSearch] = useState({'g': 0});
    const [companionTags, setTags] = useState({"search": {'g': 0}});
    /*companionTags is a URL dictionary containing tag dictionaries.
    "search" is a special entry for images displayed by Results.js*/

    function updateResults(searchResults) {
        setResults(searchResults);
    }

    //tag interaction functions
    function updateTags(URL, tags){
        if (URL=="search"){
            setSearch(tags);
        }
        else{
            let temp = companionTags;
            temp.URL = tags;
            setTags(temp);
        }
    }
    function URLtag(URL){
        if (URL=="search"){
            return searchTags;
        }
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
