// socket.io 对websocket进行扩展,从而让长连接满足所有的场景,响应的客户端需使用对应的代码库 
// socket.io 使用特性检测的方式来决定使用: websocket / ajax长轮询 / flash 等方式建立连接
// 支持 IE8+ 



const io = require('socket.io')(8000, {
  path: '/',
  serveClient: true,
  origins: '*:*',
  // below are engine.IO options
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
});

let map = { }
io.on('connection', client => { 
  console.log('connection');
  
  client.on('login', id => { 
    console.log('login:', id);
    map[id] = client; 
    
    // client.broadcast.emit('receive message', 'world2');
    // client.emit('receive message', 'world3' );
    if ( map['user1'] ) {
      map['user1'].emit('receive message', 'word 123' );
    }
  });
  
  client.on('transmit message', data => { 
    console.log('transmit message:', data);
    
    
    setTimeout(function(){
      io.emit('receive message', 'world1');
    },1000)
    
    
  });
  
  client.on('disconnect', function(){
    console.log('user disconnected');
  });
});

// io.listen(8000);












