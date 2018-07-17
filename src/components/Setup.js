import React from 'react';
import {connect, bindActionCreators} from 'react-redux'
import {sendUser, addUser, listUsers, setUsers} from '../actions/index'

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
  }

  componentDidMount(){
    ws = new WebSocket('ws://localhost:8989');

    ws.onopen = ()=> {
      this.setState({
        ...this.state,
        socket: ws
      });

      ws.send(JSON.stringify({text: 'open'}));

      // window.onbeforeunload = function() {
      //   ws.onclose = () => {
      //
      //   }

      //   ws.close()
      //   };
    };

    window.onbeforeunload = function () {
      ws.send(JSON.stringify({type: 'detach_player', user: sessionStorage.getItem('player'), army:sessionStorage.getItem('army') }));
      ws.close();
    };

    ws.onmessage = (event) =>{
      var data = JSON.parse(event.data);

      console.log(this.props.list());

      if(data.type === "userList"){
        this.setState({
          ...this.state,
          allPlayers: data.users
        });

        this.props.setUsers(data.users);
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
    !this.state.sent ?
      this.props.sendUser({name: this.state.user.name, army: this.state.user.army, socket: this.state.socket})
      :
      '';

    this.setState({
      ...this.state,
      sent: true
    });

    sessionStorage.setItem('player', this.state.user.name);
    sessionStorage.setItem('army', this.state.user.army);
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

  changeName(event)
  {
    event.preventDefault(); // Let's stop this event.
    console.log(event);
  }

  render(){
    console.log('state');
    console.log(this.state);
    console.log(this.props.users);

    return (
      <div id="setupPage">
        <div id="players">
            {!this.state.sent && !sessionStorage.getItem('player') ? (
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
              </div>) : ''
            }
          {
            this.props.users.map((user, index)=>{
                var pl = (
                  <div key={`${index}_${user.name}_${user.army}`}><p>{user.name}</p><p>{user.army}</p></div>
                  );

                if(sessionStorage.getItem('player')=== user.name && sessionStorage.getItem('army')=== user.army){
                  pl = (
                    <div key="player0">
                      <p>You:</p>
                      <div onClick={this.changeName.bind(this)} key={`${index}_${user.name}_${user.army}`}><p>{user.name}</p><p>{user.army}</p></div>
                    </div>
                  );
                }

                return pl;
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
    list: () => dispatch(listUsers()),
    setUsers: (users) => dispatch(setUsers(users))
  }
}

function mapStateToProps(state){
  return {
    users: state.users
  }
}

export const Setup = connect(mapStateToProps, mapDispatchToProps)(Init);

