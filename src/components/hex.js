import React from 'react';

export default class Hex extends React.Component {
    propsPrint = ()=>{
        console.log(this.props.grid);
    }

    render(){
        return (
            <div className="hex" onClick={this.propsPrint}>&#x2B22;{this.props.children}</div>
        )
    }
}