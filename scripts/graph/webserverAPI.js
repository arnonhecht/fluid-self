if (isWebserver()) {
  socket = io();
  $('form').submit(function(){
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });
  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });
  socket.on('update_webgl_view', function(msg){
    globalNetStateJson = msg;
    console.log("Got net representation from server..");
  });

  function getNetObject() {
    socket.emit('update_webgl_view');
    setTimeout(getNetObject, 100);
    return false;
  }
  getNetObject();

}

function isWebserver() {
    return false;//(typeof io != 'undefined');
}

$('#is_webserver_id').text(isWebserver() ? "Webserver !!!" : "Browser !!!");