import React from 'react';

class HexSVG extends React.Component{

  render(){
    const hex        = this.props,
          transform  = `matrix(1,0,0,1,${hex.usePoints})`,
          onBoard    = hex.givenTile,
          alreadySet = onBoard && onBoard.set;

    var   directionsDraw = null;


    if (onBoard && onBoard.directions){
      const directions = onBoard.directions;

      var dirs = [];

      if (directions.length === 1 && directions[0] === "all"){

        console.log('all');

        const getDirs = [1,2,3,4,5].map(el => {
            return <polygon points="0,30 0,0 30,0" transform={transform}></polygon>;
        });

        directionsDraw = getDirs;
      }
    }

    console.log(directionsDraw);

    return (
      [<use
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
      </use>,
      <text transform={transform}>
        <tspan x={50} y={50} textAnchor="middle" alignmentBaseline="central" textLength="80" lengthAdjust="spacingAndGlyphs">{onBoard ? onBoard.name : null}</tspan>
      </text>,
      !!directionsDraw ? directionsDraw : ''
      ]
    )
  }
}

export default HexSVG;


