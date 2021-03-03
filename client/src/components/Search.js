import React, {useState} from 'react'

const GCS_API = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyA7dlHVnMDTeovWPkXJ5Cq7thDAAgDjOdk&cx=89288bec62f180088&q='

function Search(props) {
  const [query, setQuery] = useState('');

  function executeSearch() {
    if (query.length === 0) {
      return;
    }

    fetch(GCS_API + query)
      .then(response => response.json())
      .then(result => props.updateSearchResults({
        images: result.items,
        tagNames: query.split(' ')
      }))
      .catch(err => console.log(err));
  }

  async function handleChange(event) {
    setQuery(event.target.value);
  }

  return (
    <form class="Search">
      <input class="SearchTextBox"
        type="text"
        value={query}
        onChange={handleChange} />
      <input class="SearchButton"
        type="button"
        value="Search"
        onClick={executeSearch} />
    </form>
  )
}

export default Search;
