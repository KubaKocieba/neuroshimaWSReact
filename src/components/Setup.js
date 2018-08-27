import React from 'react';
import {connect} from 'react-redux'
import { GithubPicker } from 'react-color'
import {sendUser, setUsers, editUser} from '../actions/setUsers'
import * as gameActions from '../actions/gameActions'
import * as boardActions from "../actions/boardActions";
import {Armies} from '../helpers/armies';
import _ from 'lodash';

const colorsForPicker = [
        '#9F0500',
        '#B0BC00',
        '#009CE0',
        '#FCDC00',
        '#000000',
        '#AB149E',
        '#f00000'
];

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

const COLOR_ERROR_MESSAGE = 'Please use another color, this one is already taken';
const NAME_ERROR_MESSAGE = 'Please put an unique name, this one is already in use';

var ws;

class Init extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      user:{
        name: '',
        army: 'celestial',
        color: '#000000',
        whichInArray: null,
        ready: false
      },
      allPlayers: [],
      socket: null,
      sent: false,
      colorEdit: false,
      error: null
    };

    this.startGame = this.startGame.bind(this);
  }

  componentDidMount(){
    ws = new WebSocket('ws://10.0.166.67:8989');

    this.props.saveSocket(ws);

    ws.onopen = ()=> {
      this.setState({
        ...this.state,
        socket: ws
      });

      ws.send(JSON.stringify({text: 'new client connected'}));
    };

    window.onbeforeunload = function () {
      ws.send(JSON.stringify({type: 'detach_player', user: sessionStorage.getItem('player'), army:sessionStorage.getItem('army') }));
      sessionStorage.clear();
      ws.close();
    };

    ws.onmessage = (event) =>{
      var data = JSON.parse(event.data);

      switch(data.type){
        case 'userList':
          this.setState({
            ...this.state,
            allPlayers: data.users
          });

          let thisUserData = {...this.state.user};

          thisUserData.whichInArray = data.users.findIndex((user) => {
            const {name, army, color,ready} = user,
                  compared = {name, army, color, ready},
                  thatOne = {
                    name: this.state.user.name,
                    army: this.state.user.army,
                    color: this.state.user.color,
                    ready: this.state.user.ready
                  },
                  lookingFor = _.isEqual(thatOne, compared);

            return lookingFor;
          });


          this.setState({
            user: {...thisUserData}
          });

          var modify = [...data.users];

          modify[thisUserData.whichInArray] = thisUserData;

          this.setState({
            allAreReady: data.users.every(user=>!!user.ready)
          });

          this.props.setUsers(modify);
          break;

        case 'tooMany':
          alert('Sorry, maximum player number reached. Cannot join the game!');
          break;

        case 'gameStarted':
          this.props.startGame(data.activePlayer);
          break;

        case 'nextPlayerStarted':
          this.props.nextPlayerStarted(data);
          break;

        case 'lastRound':
          this.props.lastRound(data.activePlayer);
          break;

        case 'tilePutOnBoard':
          console.log(data);
          this.props.putTile({...data.tile, byPlayer: data.byPlayer, color: data.color});
          break;

        default :
          console.log(data);
          break;
      }
    }
  }

  componentDidUpdate(prevProps){
    if(this.props !== prevProps){
      this.setState({
        allAreReady: this.props.users.every(user=> !!user.ready)
      });

      if(this.state.allPlayers.findIndex(player =>{
        return player.color === this.state.user.color;
      }) !== -1 && !this.state.edit)
      {
        this.setState({
          user: {
            ...this.state.user,
            color: colorsForPicker[Math.floor(colorsForPicker.length * Math.random())]
          }
        })
      }
      else{
        this.setState({
          error: null
        })
      }
    }
  }

  playerInput(event){
    this.setState({
      user: {
        ...this.state.user,
        name: event.target.value
      }
    });

    if(this.state.allPlayers.findIndex(player =>{
      return player.name === event.target.value;
    }) === -1){
      this.setState({
      error: null,
      });
    }else{
      this.setState({
        error: NAME_ERROR_MESSAGE
      });
    }
  }

  playerAdd()
  {
    if (!this.state.sent){
      this.props.sendUser({
          ...this.state.user,
        socket: this.state.socket,
        tiles: Armies[this.state.user.army]
      });
    }

    this.setState({
      ...this.state,
      sent: true
    });

    sessionStorage.setItem('player', this.state.user.name);
    sessionStorage.setItem('army', this.state.user.army);
    sessionStorage.setItem('color', this.state.user.color);
  }

  editPlayer(){
    sessionStorage.setItem('player', this.state.user.name);
    sessionStorage.setItem('army', this.state.user.army);
    sessionStorage.setItem('color', this.state.user.color);

    if (this.state.sent){
      this.props.editUser({
        ...this.state.user,
        socket: this.state.socket,
        tiles: Armies[this.state.user.army]
      });
    }

    this.setState({
      edit: false
    });
  }

  setArmy(event){
    this.setState({
      user: {
        ...this.state.user,
        army: event.target.id,
      }
    }
    );
  }

  startGame(){
    ws.send(JSON.stringify({type: 'start_the_game'}));
  }

  changePlayerData(event)
  {
    this.setState({
      edit: true
    });
  }

  submitReady = () =>{
    var userState = {...this.state.user};

    let isReady = userState.ready;

    userState.ready = !isReady;

    this.setState({
      user:{
        ...userState
      }
    });

    ws.send(JSON.stringify({type: 'player_ready', data: userState}));
  }

  handleColorChange = (color) => {
    let data = {...this.state.user};

    data.color = color.hex;

    this.setState({
      user: data
    });

    if(this.state.allPlayers.findIndex(player =>{
      return player.color === color.hex;
    }) !== -1)
    {
      this.setState({
        error: COLOR_ERROR_MESSAGE
      })
    }
    else{
      this.setState({
        error: null
      })
    }
  };

  render(){
    let colorSelStyle = {
        display: 'inline-block',
        width: '20px',
        height: '20px',
        backgroundColor: this.state.user.color,
        borderRadius: '5px',
        margin: 'auto auto',
        color: this.state.user.color,
        verticalAlign: 'middle'
      },
      colorChoose = this.state.colorEdit ?
        (
          <div>
            <GithubPicker
              triangle="hide"
              color={this.state.user.color}
              onChange={this.handleColorChange}
              colors={colorsForPicker}
            />
            <button
              style={{display: 'block', margin: 'auto auto', marginTop: '10px'}}
              onClick={() => {this.setState({colorEdit: false})}}
              disabled={this.state.error}
            >OK
            </button>
          </div>)
        : <span
            onClick={() => {
              !this.state.error || this.state.error === COLOR_ERROR_MESSAGE ? this.setState({colorEdit: true}) : null;
              }}
            style={colorSelStyle}></span>,
      showPlayers = this.props.users.map((user, index)=>{
        var rgbColor = hexToRgb(user.color),
          playerColor = {
            padding: '5px 5px',
            display: 'inline',
            border:'2px solid' + user.color,
            borderRadius: '5px',
            backgroundColor: `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.5)` ,
          },
          pl = (
            <div className={'playerInSetup playerReady' + user.ready} key={`${index}_${user.name}_${user.army}_${user.color}`}>
              <p>Player {index + 1}:</p>
              <p style={playerColor}>{user.name}</p><p>{user.army}</p>
              <p className={'statusReady ' + user.ready}>{user.ready ? 'Ready' :'Not ready'}</p>
            </div>
          );

        if(
          sessionStorage.getItem('player')=== user.name
          && sessionStorage.getItem('army')=== user.army
          && sessionStorage.getItem('color')=== user.color
        ){
          pl = !this.state.edit ? (
            <div className={'playerInSetup playerReady' + user.ready} key={`you ${index}_${user.name}_${user.army}`}>
              <p>You:</p>
              <div onClick={this.changePlayerData.bind(this)}
                   key={`${index}_${user.name}_${user.army}`}>
                <p style={playerColor}>{user.name}</p>
                <p>{user.army}</p>
                <p className={'statusReady ' + user.ready}>{user.ready ? 'Ready' : 'Not Ready'} to play</p>
              </div>
              <button className="readyBtn" onClick={this.submitReady}>{!user.ready ? 'Ready' : 'Not Ready'}</button>
            </div>
          ) : null;
        }

        return pl;
      });

    return (
      <div id="setupPage">
        <div id="players">
            {this.state.edit || (!this.state.sent && !sessionStorage.getItem('player')) ? (
              <div id="player">
                <label>You: </label>
                <p>
                  <input disabled={this.state.colorEdit || this.state.error === COLOR_ERROR_MESSAGE} onChange={this.playerInput.bind(this)}  type="text" id="playerId" />
                </p>
                <p>
                  <span className="errorText">{this.state.error}</span>
                </p>
                <div>Choose color: {colorChoose}</div>
                <p><label>Army:</label></p>
                <div id="armySelection">
                  <div  onClick={this.setArmy.bind(this)}><span id="celestial">Celestial</span></div>
                  <div  onClick={this.setArmy.bind(this)}><span id="modesto">Modesto</span></div>
                  <div  onClick={this.setArmy.bind(this)}><span id="liar">Liar</span></div>
                </div>
                <button disabled={this.state.error || this.state.colorEdit || !this.state.user.name} onClick={() => {this.state.edit ? this.editPlayer() : this.playerAdd()}}>Confirm</button>
              </div>) : ''
            }
          {showPlayers}

        </div>
        <button id="startNameBtn" disabled={this.props.users.length < 2 || !this.state.allAreReady} onClick={this.startGame }>Start</button>

      </div>
      )
  }
}

function mapDispatchToProps(dispatch){
  return {
    sendUser: (user) => dispatch(sendUser(user)),
    editUser: (user) => dispatch(editUser(user)),
    setUsers: (users) => dispatch(setUsers(users)),
    startGame: (activePlayer) => dispatch(gameActions.startGame(activePlayer)),
    nextPlayerStarted: (nextPlayer) => dispatch(gameActions.nextPlayerStarted(nextPlayer)),
    saveSocket: (socket) => dispatch(gameActions.saveSocket(socket)),
    lastRound: (user) => dispatch(gameActions.lastRound(user)),
    putTile: (tileData) => dispatch(boardActions.putTile(tileData))
  }
}

function mapStateToProps(state){
  return {
    users: state.users
  }
}

export const Setup = connect(mapStateToProps, mapDispatchToProps)(Init);

