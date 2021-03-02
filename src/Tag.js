import React, {useRef} from 'react'

class Tag extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: this.props.name,
            score: this.props.score,
            voted: false};
        console.log(this.state.name);

        this.handleClick = this.handleClick.bind(this);
    }

    //handles voting on a tag
    handleClick(){
        if (!this.state.voted) {
            this.setState(
                {name: this.state.name, score: this.state.score +1, voted: true}
                );
            //backend request to go here
        }
        else{
            this.setState(
                {name: this.state.name, score: this.state.score -1, voted: false}
            );
            //backend request to go here
        }
    }

    render(){
        const string = "# "+this.state.name+" ("+this.state.score+")"
        //give 2 render methods based on if the tag has been voted or not
        return (
            <input type="button"
            value={string}
            onClick={this.handleClick} />
        );
    }
}

export default Tag;