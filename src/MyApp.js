import React, {useState} from 'react'
import Form from './Form';
import Results from './Results';

function MyApp() {
    const [results, setResults] = useState([]);

    function updateResults(searchResults) {
        setResults(searchResults);
    }

    return (
        <div className="container">
            <Form handleSearch={updateResults} />
            <Results results={results} />
        </div>
    )
}

export default MyApp;
