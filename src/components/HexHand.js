import React from 'react'
import * as Honeycomb from 'honeycomb-grid'
import {directionsDraw} from "../helpers/others";
import {HEX_SIZE} from "./hexBoard";

const Hex = Honeycomb.extendHex({ size: 40 , orientation: 'flat'}),
  corners = () => {
    let pointsArray = [];

    Object.values(Hex().corners()).forEach(value=>{
      pointsArray.push(value.x);
      pointsArray.push(value.y);
    });

    return pointsArray;

  };

const HexHandSVG = (props) => {
    const hex        = props,
          transform  = `matrix(1,0,0,1,10,10)`;

    let allowRemove = props.name.indexOf('hq') === -1 ? (
      <g onClick={props.click} style={{cursor: 'pointer'}}>
        <circle fill="#ffffff" cx={20} cy={20} r={10} strokeWidth={2} stroke="red"></circle>
        <text >
          <tspan textAnchor="middle" alignmentBaseline="central" x={20} y={19}>x</tspan>
        </text>
      </g>)
      : null;
    var directions = directionsDraw(props.directions, 40, transform);

    return (
      <svg
        onDragStart={props.dragStart}
        width={100}
        height={100}
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        style={
          {
            transformOrigin: 'top',
            transform: `scale(${Math.min(1)})`,
            cursor: 'move',
          }
        }
      >
        <defs id={'hexDefs1003'}></defs>
        <symbol id="handHexSybmbol">
          <polygon id="handHexPolygon" onDragStart={props.dragStart} points={corners().toString()}></polygon>
        </symbol>
        <g>
          <use
            onDragStart={props.dragStart}
            href="#handHexPolygon"
            stroke={props.stroke}
            strokeWidth={3}
            fill={props.fill}
            transform={transform}
          >{props.name}</use>
          <text fontSize="12px" transform={transform} onDragStart={props.dragStart}>
            <tspan
              onDragStart={props.dragStart}
              x={50} y={50} textAnchor="middle" alignmentBaseline="central" textLength="50" lengthAdjust="spacingAndGlyphs">{props.name}</tspan>
            {allowRemove}
          </text>
          {!!directions ? directions : ''}
          { allowRemove }
        </g>
      </svg>
    )
};

export default HexHandSVG;