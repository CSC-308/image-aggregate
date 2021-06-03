import React, {useState} from 'react'

const GCS_URL = process.env.REACT_APP_GCS_API_URL;
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function Search(props) {
  const [query, setQuery] = useState('');

  async function executeSearch() {
    if (query.length === 0) {
      return;
    }

    props.updateSearchResults({
      images: [],
      tagNames: []
    });
    props.updatePostResults([])

    searchDatabase(query.split(' '));
    searchWeb(query);
  }

  async function searchDatabase(query) {
    console.log(SERVER_URL + '/search/' + query);
    fetch(SERVER_URL + '/search/' + query)
      .then(response => response.json())
      .then(result => props.updatePostResults(result))
      .catch(err => console.log(err));
  }

  async function searchWeb(query) {
    fetch(GCS_URL + query)
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


