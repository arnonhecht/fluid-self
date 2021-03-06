//var net = require('net');   
var osc = require('node-osc'); //include node-osc library https://github.com/TheAlphaNerd/node-osc

var HOST = '127.0.0.1';
var PORT = 6699;

var oscServer = new osc.Server(PORT, HOST);
oscServer.on("message", function (msg, rinfo) {
      console.log(msg);
});

/*  Old usage using 'net'
// Create a server instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The sock object the callback function receives UNIQUE for each connection
var server = net.createServer(function(sock) {
    
    // We have a connection - a socket object is assigned to the connection automatically
    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
    
    // Add a 'data' event handler to this instance of socket
    sock.on('data', function(data) {
        
        console.log('DATA ' + sock.remoteAddress + ': ' + (data));
        // Write the data back to the socket, the client will receive it as data from the server
        // sock.write('Data: "' + data + '"');
        // sock.destroy();
    });
    
    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
        console.log('Listener: Connection Closed: ' + sock.remoteAddress +' '+ sock.remotePort);
        process.exit(code=0);
    });

});
server.listen(PORT, HOST);

// server.on('error', function (e) {
//   if (e.code == 'EADDRINUSE') {
//     console.log('Address in use, retrying...');
//     setTimeout(function () {
//       server.close();
//       server.listen(PORT, HOST);
//     }, 1000);
//   }
// });

console.log('Server listening on ' + HOST +':'+ PORT);


*/