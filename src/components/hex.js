import React from 'react';

export default class Hex extends React.Component {
    propsPrint = ()=>{
        console.log(this.props.grid);
    }

    render(){
        return (
            <div className="hex"
                 onDrop={(event) => !this.props.grid.content ? this.props.drop(event, this.props.fieldNumber) : (event.preventDefault(), event.stopPropagation(),console.log('zajeta'))}
                 onDragOver={(event)=> this.props.dragOverAction(event)}
                 onClick={this.propsPrint}>&#x2B22;
                <span>{this.props.grid.content ? this.props.grid.content.name : null}</span>
                 </div>
        )
    }
}