import React from 'react';
import * as SVG from 'svg.js'
import * as Honeycomb from 'honeycomb-grid'

const gridBySVGjs = ()=>{
      const draw = SVG('cluster');

    console.log(draw);
    console.log(<svg></svg>);

    const Hex = Honeycomb.extendHex({ size: 40 , orientation: 'flat'})
    const Grid = Honeycomb.defineGrid(Hex)
    // get the corners of a hex (they're the same for all hexes created with the same Hex factory)
    const corners = Hex().corners()
    const hexSymbol = draw.symbol()
    //map the corners' positions to a string and create a polygon
    .polygon(corners.map(({ x, y }) => `${x},${y}`))
    .fill('#fff')
    .stroke({ width: 3, color: '#000' })

    Grid.hexagon({ radius: 2 }).forEach((hex,index) => {
      const { x, y } = hex.toPoint();
      // use hexSymbol and set its position for each hex
      draw.use(hexSymbol).translate(x + 180, y + 180);
      draw.text((el)=>{
        el.tspan('hex'+ index).newLine();
      }).translate(x + 200, y + 200);
    });
}

class HexGridSVGjs extends React.Component{
  componentDidMount(){
    gridBySVGjs();
  }

  render(){
    return (
      <div id="cluster">

      </div>
    )
  }
}

export default HexGridSVGjs;
