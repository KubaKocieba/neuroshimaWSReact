import React, { Component } from 'react'
import {connect} from 'react-redux'
import * as boardActions from '../actions/boardActions'
import * as gameActions from '../actions/gameActions'

import Hex from './hex';
class hexBoard extends React.Component {
    constructor(props){
        super(props);
    }

    componentDidMount(){
        //console.log(this.state.board);
    }

    onDropHandle = (event, onField) =>{
        event.preventDefault();
        event.stopPropagation();
        console.log('drop');

        console.log('dropped here on field', onField);
        let tileReceived = JSON.parse(event.dataTransfer.getData('text/plain'));

        this.props.setTile({...tileReceived, target: onField}, this.props.game.socket);
        //this.props.tileRemoveFromHand(this.props.game.playerData,tileReceived);

    }

    onDragOverHandle = (event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log('drag over');
    }


  render() {
        var fieldsOrder = [3,2,1,7,6,5,4,12,11,10,9,8,16,15,14,13,19,18,17];

      const fields = (i,j) => {
          var row = [];
          for (let x = 0;x <= j; x++){
              let key = fieldsOrder.shift();
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
      }

        const fillHexes = () => {
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
            {fillHexes()}
        </div>
      );
    }
  }

const mapStateToProps = (state) => {
    return {
        board: state.board,
        game: state.game
    }
}

  const mapActions = (dispatch) => {
    return {
        setTile: (tile, socket) => dispatch(boardActions.setTile(tile, socket)),
        tileRemoveFromHand: (player, tile) => dispatch(gameActions.tileRemoveFromHand(player,tile))
    }
  }

  export default connect(mapStateToProps, mapActions)(hexBoard);