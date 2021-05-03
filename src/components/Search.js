import React, {useState} from 'react'

function Search(props) {
  const [query, setQuery] = useState('');

  function executeSearch() {
    if (query.length === 0) {
      return;
    }

    props.updateSearchResults({
      images: [],
      tagNames: []
    });

    fetch(process.env.REACT_APP_GCS_API_URL + query)
      .then(response => response.json())
      .then(result => props.updateSearchResults({
        images: result.items,
        tagNames: query.split(' ')
      }))
      .catch(err => console.log(err));
  }

  function handleChange(event) {
    setQuery(event.target.value);
  }

  return (
    <form className="Search">
      <input className="SearchTextBox"
        type="text" placeholder="Search"
        value={query}
        onChange={handleChange} />
      <input className="SearchButton" alt="" type="button"

        onClick={executeSearch} />
    </form>
  )
}

export default Search;


