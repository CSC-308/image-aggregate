import React from 'react'
import Tags from './Tags'

function Results(props) {
    const images = props.results.map((result, index) => {
      if (result.pagemap?.cse_image) {
          return (<div>
                    <img
                      src={result.pagemap.cse_image[0].src}
                      alt={'Search result ' + index}
                      class="searchResultImage"/>
                    <Tags URLtag={props.URLtag} URL={"search"}/>
                  </div>);
      } else {
          return (<div></div>);
      }
    });

    return images;
}

export default Results;
