import React from 'react';
import {connect, bindActionCreators} from 'react-redux'
import {sendUser, addUser, listUsers} from '../actions/index'

var ws;

class Init extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      user:{
        name: 'player0',
        army: 'celestial',
      },
      allPlayers: [],
      socket: null,
      sent: false
    }

    this.initiateGame = this.initiateGame.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  initiateGame(){
    this.action({
      type: 'ADD_USER'
    })
  }

  componentDidMount(){
    ws = new WebSocket('ws://localhost:8989');

    ws.onopen = ()=> {
      this.setState({
        ...this.state,
        socket: ws
      });

      ws.send(JSON.stringify({text: 'kupa'}));
    };

    ws.onmessage = (event) =>{
      var data = JSON.parse(event.data);

      console.log(data);

      if(data.type === "userList"){
        this.setState({
          ...this.state,
          allPlayers: data.users
        });
      }

      else if (data.type === 'userAdded') {
        this.receivePlayer(data.users);
      }
      else if (data.type === 'tooMany')
      {
        alert('Sorry, maximum player number reached. Cannot join the game!');
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
  }

  receivePlayer(data){
    this.props.addUser(data);
  }

  playerAdd()
  {
    this.props.sendUser({name: this.state.user.name, army: this.state.user.army, socket: this.state.socket});
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
    // this.setState({
    //   started: true
    // });
  }

  render(){
    return (
      <div id="setupPage">
        <div id="players">
          <div id="player">
            <label>You: </label>
            <p><input onChange={this.playerInput.bind(this)} type="text" id="playerId" /></p>
              <p><label>Army:</label></p>
              <div id="armySelection">
                <div  onClick={this.setArmy.bind(this)}><span id="celestial">Celestial</span></div>
                <div  onClick={this.setArmy.bind(this)}><span id="modesto">Modesto</span></div>
                <div  onClick={this.setArmy.bind(this)}><span id="liar">Liar</span></div>
              </div>
              <button onClick={this.playerAdd.bind(this)}>OK</button>
          </div>
          {
            this.props.users.map((user, index)=>{
              if (user.name !== this.state.user.name && user.army !== this.state.user.army)
              {
                return (
                  <div key={`${index}_${user.name}_${user.army}`}><p>{user.name}</p><p>{user.army}</p></div>
                  );
              }
            })
          }

        </div>
        <button onClick={this.startGame}>Start</button>

      </div>
      )
  }
}

function mapDispatchToProps(dispatch){
  return {
    sendUser: (user) => dispatch(sendUser(user)),
    addUser: (user) => dispatch(addUser(user)),
    listUsers: () => dispatch(listUsers())
  }
}

function mapStateToProps(state){
  console.log(state);

  return {
    users: state.users
  }
}

export const Setup = connect(mapStateToProps, mapDispatchToProps)(Init);

