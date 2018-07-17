const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8989 });

var users = [];

const broadcast = (data, ws) => {
  wss.clients.forEach((client) => {
    console.log(client === ws);
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data))
    }
  })
}

wss.on('connection', function connection(ws) {
  console.log('one connected');

  ws.send(JSON.stringify({type:'userList', users}));

  ws.on('message', function incoming(message) {
    message = JSON.parse(message);

    if (message.type && message.type === 'connect_user')
    {
      if (users.length < 4)
      {
        users = [...users, ...message.data];
        console.log(users);

        broadcast({type: 'userAdded', users}, ws);
      }
      else
      {
        ws.send(JSON.stringify({type: 'tooMany'}),ws);
      }
    }
    else{
      console.log(message);
    }
  });

});
