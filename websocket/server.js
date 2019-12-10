const http = require('http')
const url = require('url')
const path = require('path')
const WebSocket = require('ws')
const uuid = require('uuid')


const server = http.createServer( (req,res)=>{ 
  console.log(' ==== ');
})
const wss = new WebSocket.Server( { server: server,  } )

let targetClient = null; 

wss.on('connection',(ws, req)=>{
  const location = url.parse(req.url, true)
  // You might use location.query.access_token to authenticate or share sessions
  // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
  console.log('req: ', req.headers.cookie );
  
  ws.id = uuid.v4()
  
  ws.on('message', (message)=>{
    console.log(`received client[${ws.id}]: ${message}`)
  })
  ws.on('close', function() {
    console.log(`client[${ws.id}] close`)
    ws.close(); 
  })
  ws.on('error', function() {
    console.log(`client[${ws.id}] error`)
  })
  
  
  console.log('current clients count: ', wss.clients.size)
  
  if (wss.clients.size === 2) {
    targetClient = ws
  }
  
  setInterval(() => {
    if ( ws.readyState===ws.OPEN ) {
      console.log('server send ');
      ws.send('hello from server ')
    } 
    else { ws.close() }
  }, 5000) 
  
})

// 2分钟之后广播给所有的客户端
setTimeout(() => {
  wss.clients.forEach(client => {
    client.send(`server broadcast to all client => [${client.id}]: ${new Date()}`)
  })
}, 2 * 60 * 1000)

// 3分钟后给指定的客户端发送消息
setTimeout(() => {
  targetClient && targetClient.send(`server send to specific client[${targetClient.id}]: ${new Date()}`)
}, 3 * 60 * 1000)

server.listen(3000, ()=>{
  console.log('Listening on %d', server.address().port)
})

