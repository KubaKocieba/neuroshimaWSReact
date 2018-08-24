import React from 'react'
import {connect} from 'react-redux'
import * as boardActions from '../actions/boardActions'

import Hex from './hex';
class hexBoard extends React.Component {

  componentDidMount(){
      //console.log(this.state.board);
  }

  onDropHandle = (event, onField) =>{
    event.preventDefault();
    event.stopPropagation();

    let tileReceived = JSON.parse(event.dataTransfer.getData('text/plain'));

    this.props.setTile({...tileReceived, target: onField}, this.props.game.socket);
    this.props.tileRemoveFromHand(tileReceived);
  };

  onDragOverHandle = (event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('drag over');
  };


  render() {
    var fieldsOrder = [3,2,1,7,6,5,4,12,11,10,9,8,16,15,14,13,19,18,17];

    const fields = (i,j) => {
        var row = [];
        for (let x = 0;x <= j; x++){
            let key = fieldsOrder.shift();
            console.log(key);

            row.push(
                <Hex
                    fieldNumber={key}
                    key={key}
                    drop={this.onDropHandle}
                    grid={this.props.board.fields[key]}
                    dragOverAction={this.onDragOverHandle}>
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
  }

  return (
      <div id="hexCluster">
          {fillHexes()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
    return {
        board: state.board,
        game: state.game
    };
};

const mapActions = (dispatch) => {
  return {
    setTile: (tile, socket) => dispatch(boardActions.setTile(tile, socket))
  };
};

export default connect(mapStateToProps, mapActions)(hexBoard);