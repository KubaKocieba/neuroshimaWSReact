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

    if (message.type && message.type === 'connect_user')
    {
      if (users.length < 4)
      {
        users = [...users, ...message.data];

        broadcast({type: 'userList', users}, ws);
      }
      else
      {
        ws.send(JSON.stringify({type: 'tooMany'}),ws);
      }
    }
    else if (message.type && message.type === 'detach_player')
    {
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
    }
    else{
      console.log(message);
    }
  });

});
