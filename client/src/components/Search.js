import React, {useState} from 'react'


const GCS_API = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyA7dlHVnMDTeovWPkXJ5Cq7thDAAgDjOdk&cx=89288bec62f180088&q='

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

    fetch(GCS_API + query)
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


