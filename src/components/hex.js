import React from 'react';

export default class Hex extends React.Component {
    render(){
        const onBoard = this.props.givenTile,
              alreadySet = onBoard && onBoard.set;

        return (
            <div className="hex " style={{ WebkitTextStrokeColor: onBoard ? onBoard.color :'black'}}
                 onDrop={(event) => !onBoard ? this.props.drop(event, this.props.fieldNumber) : (event.preventDefault(), event.stopPropagation(),console.log('zajeta'))}
                 onDragOver={(event)=> this.props.dragOverAction(event)}
                 onClick={alreadySet? null : this.props.click}
                 onContextMenu={this.props.rightClick}
                 onWheel={onBoard && onBoard.directions[0] !== 'all' && !alreadySet ? ((event) => {this.props.wheel(onBoard.directions, event)}) : null}
                 >&#x2B22;
                <span>{onBoard ? onBoard.name : null}</span>
            </div>
        )
    }
}