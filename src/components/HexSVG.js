import React from 'react';
import {HEX_SIZE} from './hexBoard'
import {directionsDraw} from '../helpers/others';

class HexSVG extends React.Component{

  render(){
    const hex        = this.props,
          transform  = `matrix(1,0,0,1,${hex.usePoints})`,
          onBoard    = hex.givenTile,
          alreadySet = onBoard && onBoard.set;

    var   directions = onBoard ? directionsDraw(onBoard.directions, HEX_SIZE, transform) : null;

    return (
      <g>
      <use
        onClick={()=>{console.log('click')}}
        fill={onBoard ? onBoard.color : hex.fill}
        stroke={hex.stroke.color}
        strokeWidth={hex.stroke.width}
        className="hexSVG"
        href="#hexPolygon"
        transform={transform}
        onDrop={(event) => !onBoard ? hex.drop(event, hex.fieldNumber) : (event.preventDefault(), event.stopPropagation(),console.log('zajeta'))}
        onDragOver={(event)=> hex.dragOverAction(event)}
        onClick={alreadySet? null : hex.click}
        onContextMenu={hex.rightClick}
        onWheel={onBoard && onBoard.directions[0] !== 'all' && !alreadySet ? ((event) => {hex.wheel(onBoard.directions, event)}) : null}
      >
      </use>
      <text fontSize="12px" transform={transform}>
        <tspan x={50} y={50} textAnchor="middle" alignmentBaseline="central" textLength="50" lengthAdjust="spacingAndGlyphs">{onBoard ? onBoard.name : null}</tspan>
      </text>
      {!!directions ? directions : ''}
      </g>
    )
  }
}

export default HexSVG;


