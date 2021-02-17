import React, {useState} from 'react'

const GCS_API = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyA7dlHVnMDTeovWPkXJ5Cq7thDAAgDjOdk&cx=89288bec62f180088&q='

function Form(props) {
    const [query, setQuery] = useState('');

    function executeSearch() {
        if (query.length !== 0) {
            fetch(GCS_API + query)
                .then(response => response.json())
                .then(data => props.handleSearch(data.items));
        }
    }

    function handleChange(event) {
      setQuery(event.target.value);
    }

    return (
        <form class="search">
            <input type="text" value={query} onChange={handleChange} />
            <input type="button" value="Search" onClick={executeSearch} />
        </form>
    )
}

export default Form;
