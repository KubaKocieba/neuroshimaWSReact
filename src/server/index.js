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

var activePlayer = 0;

const playerChange = (player, usersArr, ws) => {

  console.log(`player ${users[player].name} is doing some moves`);

  broadcast(
  {
    type: 'nextPlayerStarted',
    activePlayer: player,
    users: usersArr
  }, ws);
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
            console.log('user ' + message.data[0].name + ' has joined the game');

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
          console.log('user ' + player['user'] + ' has left the game.')
          users.splice(toErase, 1);
        }

        broadcast({type: 'userList', users}, ws);
        break

      case 'start_the_game':
        activePlayer = Math.floor(users.length * Math.random());

        console.log('game started');
        broadcast(
          {
           type: 'gameStarted',
           activePlayer,
           users
          }, ws);

          break;

      case 'next_player':
        if (!users.length){
           console.log('no players left. game finished. waiting for new players and start...');
           activePlayer = 0;
           users = [];
          return;
        }

          activePlayer++;

          if (activePlayer > users.length - 1){
            activePlayer = 0;
          }

          playerChange(activePlayer, users, ws);
        break;

      default:
        console.log('Unsupported message');
        break;
      }
    }
    else{
      console.log(message);
    }
  });

});
