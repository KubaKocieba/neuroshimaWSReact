import React from 'react'
import {connect} from 'react-redux'
import * as boardActions from '../actions/boardActions'
import _ from 'lodash'

import Hex from './hex';

import { hexDirectionsChange } from '../helpers/hexDirections'
class hexBoard extends React.Component {

  state = {
    tempHex: {}
  }

  componentDidMount(){
      //console.log(this.state.board);
  }

  componentDidUpdate(prevProps){

  }

  onDropHandle = (event, onField) =>{
    event.preventDefault();
    event.stopPropagation();

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
    var fieldsOrder = [3,2,1,7,6,5,4,12,11,10,9,8,16,15,14,13,19,18,17];

    const fields = (i,j) => {
        var row = [];
        for (let x = 0;x <= j; x++){
            let key = fieldsOrder.shift();

            let params = this.props.board.fields[key];

            row.push(
                <Hex
                    fieldNumber={key}
                    key={key}
                    drop={this.onDropHandle}
                    givenTile={!_.isEmpty(this.state.tempHex) && this.state.tempHex.target === key ? this.state.tempHex : params.content}
                    sides={params.sides}
                    dragOverAction={this.onDragOverHandle}
                    click={this.setOnBoard}
                    wheel={this.wheelHandle}
                    rightClick={this.undoPut}
                    >
                </Hex>
            );
        }

        return row;
  };

  const fillHexes = () => {
      var rows = [];

      for(let i = 0; i <= 4 ; i++){
        let j;

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
          default:
              break;
        }

        rows.push(<div key={i}>{fields(i,j)}</div> )
      }

      return rows;
  };

  return (
    <div id="clusterContainer">
      <div id="hexCluster">
          {fillHexes()}
      </div>
    </div>
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