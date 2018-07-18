const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8989 });

var users = [];

const broadcast = (data, ws) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data))
    }
  })
}

let activePlayer = 0;

const clockTimer = (player, usersArr,ws) => {
      console.log(`player ${player} is doing some moves`);

      if (!usersArr.length){
        console.log('no players left. game finished. waiting for new players and start...');
        return;
      }

      let nextPlayer = ++player;

      if (nextPlayer > usersArr.length - 1){
          nextPlayer = 0;
      }

      setTimeout(()=>{
        broadcast(
        {
          type: 'nextPlayerStarted',
          activePlayer: nextPlayer,
          users: usersArr
        }, ws);

        clockTimer(nextPlayer, usersArr, ws);
      }, 90000);
}

wss.on('connection', function connection(ws) {
  console.log('one connected');

 if (users.length < 4){
  ws.send(JSON.stringify({type:'userList', users}));
 }
 else
 {
  ws.send(JSON.stringify({type: 'tooMany'}),ws);
 }

  ws.on('message', function incoming(message) {
    message = JSON.parse(message);

    if (message.type)
    {
      switch(message.type)
      {
        case 'connect_user':
          if (users.length < 4)
          {
            users = [...users, ...message.data];

            broadcast({type: 'userList', users}, ws);
          }
          else
          {
            ws.send(JSON.stringify({type: 'tooMany'}),ws);
          }
          break;
      case 'detach_player':
        let {user, army} = message,
            player = {
              user,
              army
            };

        let toErase = users.findIndex((el)=> {
          return el['name'] == player['user'] && el['army'] == player['army'];
        });

        if (toErase >= 0)
        {
          users.splice(toErase, 1);
        }

        broadcast({type: 'userList', users}, ws);
        break

      case 'start_the_game':
        activePlayer = Math.floor(users.length * Math.random());

        broadcast(
          {
           type: 'gameStarted',
           activePlayer,
           users
          }, ws);

          clockTimer(activePlayer, users, ws);
        break;

      // case 'next_player':
      //   let nextPlayer = ++message.activePlayer;

      //   if (nextPlayer > users.length - 1){
      //     nextPlayer = 0;
      //   }

      //   broadcast(
      //     {
      //      type: 'nextplayerStarted',
      //      activePlayer: nextPlayer,
      //      users
      //     }, ws);

      default:
        console.log('Unsupported message');
      }
    }
    else{
      console.log(message);
    }
  });

});
