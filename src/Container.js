import React from 'react'

class Collection extends React.Component {
    constructor (props) {
        super(props);
        const imageList = [];
        this.state = {
            name: "new_collection",
            imageList
        };
    }

    handleName(newName) {
        this.setState({
            name: newName,
            ImageList
        });
    }

    handleAdd(newImage) {
        this.setState.imageList.append(newImage);
    }

    handleRemove(imageToRemove) {
        const newImageList = this.state.imageList.map((image) => image.url !== imageToRemove.url)
        this.setState.imageList = newImageList;
    }

    render () {
        return (
            <ul>
                {this.setState.imageList.map((image) => (
                    <li key={image.url}>
                        <img src={image.url} alt="${image.name}" />
                    </li>
                ))}
            </ul>
        )
    }
}

/*var Collection = React.createClass({
    createHtmlMarkupStringOfImageList: function() {
        var htmlString = ReactDOMServer.renderToStaticMarkup(
            <ImageList images = {this.props.images} />
        );

        var htmlMarkup = {
            html: htmlString
        };

        return JSON.stringify(htmlMarkup);
    }
})*/

export default Container;