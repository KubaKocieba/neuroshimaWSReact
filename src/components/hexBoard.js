import React, { Component } from 'react'

import Hex from './hex';
class hexBoard extends React.Component {
    constructor(props){
        super(props);
    }

    state = {
        board: this.props.board
    }
    componentDidMount(){
        console.log(this.state.board);
    }


  render() {
        var fieldsOrder = [3,2,1,7,6,5,4,12,11,10,9,8,16,15,14,13,19,18,17];

      const fields = (i,j) => {
          var row = [];
          for (let x = 0;x <= j; x++){
              //row.push(<div className="hex">&#x2B22;<span>{fieldsOrder.shift()}</span></div>);
              let key = fieldsOrder.shift();
              row.push(<Hex key={key} grid={this.state.board.fields[key]}><span>{key}</span></Hex>);
          }

          return row;
      }

        const rotatedRows = () => {
            var rows = [];

            for(let i = 0; i <= 4 ; i++){

                var j;

                switch(i){
                    case 0:
                    case 4:
                        j = 2;
                        break;
                    case 1:
                    case 3:
                        j = 3;
                        break;
                    case 2:
                        j = 4;
                        break;
                }


                rows.push(<div key={i}>{fields(i,j)}</div> )
            }

            return rows;
        }



    return (
        <div id="hexCluster">
            {rotatedRows()}
            {/*<div>*/}
              {/*<div className="hex">&#x2B22;<span>1</span></div>*/}
              {/*<div className="hex">&#x2B22;<span>2</span></div>*/}
              {/*<div className="hex">&#x2B22;<span>3</span></div>*/}
            {/*</div>*/}
            {/*<div>*/}
            {/*<div className="hex">&#x2B22;<span>4</span></div>*/}
            {/*<div className="hex">&#x2B22;</div>*/}
            {/*<div className="hex">&#x2B22;</div>*/}
            {/*<div className="hex">&#x2B22;</div>*/}
          {/*</div>*/}
          {/*<div>*/}
            {/*<div className="hex">&#x2B22;</div>*/}
            {/*<div className="hex">&#x2B22;</div>*/}
            {/*<div className="hex">&#x2B22;</div>*/}
            {/*<div className="hex">&#x2B22;</div>*/}
            {/*<div className="hex">&#x2B22;</div>*/}
          {/*</div>*/}
          {/*<div>*/}
            {/*<div className="hex">&#x2B22;</div>*/}
            {/*<div className="hex" onDragOver={this.dragOverAction } onDrop={this.dropped}>&#x2B22;</div>*/}
            {/*<div className="hex">&#x2B22;</div>*/}
            {/*<div className="hex">&#x2B22;</div>*/}
          {/*</div>*/}
          {/*<div>*/}
            {/*<div className="hex">&#x2B22;</div>*/}
            {/*<div className="hex">&#x2B22;</div>*/}
            {/*<div className="hex">&#x2B22;</div>*/}
          {/*</div>*/}

        </div>
      );
    }
  }

  export default hexBoard;