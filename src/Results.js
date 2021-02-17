import React from 'react'

function Results(props) {
    const images = props.results.map((result, index) => {
      if (result.pagemap?.cse_image) {
          return (<div>
                    <img
                      src={result.pagemap.cse_image[0].src}
                      alt={'Search result ' + index}
                      class="searchResultImage"/>
                  </div>);
      } else {
          return (<div></div>);
      }
    });

    return images;
}

export default Results;
