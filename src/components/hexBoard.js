import React from 'react'
import {connect} from 'react-redux'
import * as boardActions from '../actions/boardActions'
import _ from 'lodash'
// import Hex from './hex';
import * as Honeycomb from 'honeycomb-grid'

import { hexDirectionsChange } from '../helpers/hexDirections'
import HexSVG from './HexSVG'
import * as SVG from 'svg.js'


const HEX_SIZE = 50;

const Hex = Honeycomb.extendHex({ size: HEX_SIZE , orientation: 'flat'}),
      corners = () => {
          let pointsArray = [];

          Object.values(Hex().corners()).forEach(value=>{
            pointsArray.push(value.x);
            pointsArray.push(value.y);
          });

          return pointsArray;

      },
      Grid = Honeycomb.defineGrid(Hex),
      hexGrid = Grid.hexagon({ radius: 2 });

class hexBoard extends React.Component {

  state = {
    tempHex: {}
  }

  componentDidMount(){
      //console.log(this.state.board);
      console.log(SVG.get('hexBoard'));
  }

  componentDidUpdate(prevProps){

  }

  onDropHandle = (event, onField) =>{
    event.preventDefault();
    event.stopPropagation();

    console.log(onField);

    let tileReceived = JSON.parse(event.dataTransfer.getData('text/plain'));

    this.setState({
      tempHex: {
        ...tileReceived,
        target: onField,
        color: this.props.users[this.props.game.activePlayer].color
      }
    });
  };

  onDragOverHandle = (event) => {
    event.preventDefault();
    event.stopPropagation();

  };

  wheelHandle = (directions, event)=> {
    this.setState({
      tempHex: {
        ...this.state.tempHex,
        directions: hexDirectionsChange(directions, event.deltaY)
      }
    });
  }

  undoPut = (event) => {
    event.preventDefault();
    event.stopPropagation();

    this.setState({
      tempHex: {}
    })
  }

  setOnBoard = () => {
    const tileReceived = {...this.state.tempHex, set: true};

    this.setState({
      tempHex: {}
    })

    this.props.setTile(tileReceived, this.props.game.socket);
    this.props.tileRemoveFromHand(tileReceived);
  }


  render() {
    var fieldsOrder = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];

    return (
      <svg id="hexBoard"
           width={8*HEX_SIZE + 5 + 'px'}
           height={5*Math.sqrt(3)*HEX_SIZE + 10 + 'px'}
           xmlns="http://www.w3.org/2000/svg"
           version="1.1"
      >
        <defs id={'hexDefs1002'}></defs>
        <symbol id="hexSybmbol">
          <polygon id="hexPolygon" points={corners().toString()}></polygon>
        </symbol>
        {
          hexGrid.map((hex,index) =>{
            const { x, y } = hex.toPoint();

            let key = fieldsOrder.shift();

            let params = this.props.board.fields[key];

            return (
              <HexSVG
                fieldNumber={key}
                key={`hex${index}`}
                text={params.name}
                usePoints={`${x+3*HEX_SIZE}, ${y+3.5*HEX_SIZE}`}
                textPoints={{x: x+4*HEX_SIZE, y: y+4*HEX_SIZE}}
                fill={'white'}
                stroke={{ width: 2, color: '#000' }}
                corners={corners().toString()}
                drop={this.onDropHandle}
                givenTile={!_.isEmpty(this.state.tempHex) && this.state.tempHex.target === key ? this.state.tempHex : params.content}
                sides={params.sides}
                dragOverAction={this.onDragOverHandle}
                click={this.setOnBoard}
                wheel={this.wheelHandle}
                rightClick={this.undoPut}
              />
              )
          })
        }
      </svg>
    );
  }
}

const mapStateToProps = (state) => {
    return {
        board: state.board,
        game: state.game,
        users: state.users
    };
};

const mapActions = (dispatch) => {
  return {
    setTile: (tile, socket) => dispatch(boardActions.setTile(tile, socket)),
    putTile: (tileObj) => dispatch(boardActions.putTile(tileObj))
  };
};

export default connect(mapStateToProps, mapActions)(hexBoard);