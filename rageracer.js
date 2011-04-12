var http = require('http'),
    sys  = require('sys'),
    fs   = require('fs'),
    io   = require('socket.io');



function hurdleGen() {
    var posXArr = new Array(2);
    var temp;
              
    posXArr[0] = Math.floor(Math.random()*550) + 100;
                  
    for (var i = 1; i < 2; i++) {
        temp = Math.floor(Math.random()*550) + 100;
        while (Math.abs(temp - posXArr[0]) < 80) {
            temp = Math.floor(Math.random()*550) + 100;
        }
        posXArr[i] = temp;
    }
    return posXArr;
}


function withinRange(curPos, hurdleLoc, range) {
    if (curPos > (hurdleLoc - range) || (curPos < (hurdleLoc + range))) {
      return true;
    } else {
      return false;
    }
}

var server = http.createServer(function(request, response) {
  response.writeHead(200, {
    'Content-Type': 'text/html'
  }); 
  var rs = fs.createReadStream(__dirname + '/test.html');
  sys.pump(rs, response);
});

var socket = io.listen(server);

socket.on('disconnect', function () {
});


socket.on('connection', function(client) {  
  //require('eyes').inspect(client.request.headers);
  var uInfo = {
    uName : "",
    posX: 0,
    posY: 0,
    isPenalty: 0,
    hurdleArr: []
  };
  var speedT = 0;
  var pCenter = 0;
  var jumpDist = 10;
  var plusOrMinus = 20;

  setTimeout(function() {
  
    }, 30*60);
  uInfo['hurdleArr'] = hurdleGen();
  //console.log(uInfo['hurdleArr']);
  client.on('message', function(message) {
    if (message['isJumping'] == null || message['moveSpeed'] == null) {
      return;
    }
     
    //uInfo['isJumping'] = message['isJumping']; 
    uInfo['uName'] = message['uName'];
    var shouldJump = message['isJumping']; 
    if (shouldJump) {
      pCenter = jumpDist + uInfo['posX'];
      steps = 6;

      var base = uInfo['posX'];
      for (var i = 1; i < steps; i ++) {
        uInfo['posX'] = base + (i);
        uInfo['posY'] = (5*jumpDist * Math.sin( Math.PI * i / steps));
        uInfo['isPenalty'] = 0;
        //console.log(uInfo['posX']);
        socket.broadcast(uInfo);
      }
      if (withinRange(uInfo['posX'], uInfo['hurdleArr'], 6)) {
        uInfo['ifPenalty'] = 1;
      }
      shouldJump = 0;
    } else {
      speedT = Number(message['moveSpeed']);
      
      uInfo['posX'] =  3 * (Number(message['moveSpeed']))  + Number(uInfo['posX']); 
      uInfo['posY'] = 0;
    }
    //uInfo['posY']; 
    //console.log(uInfo);
    socket.broadcast(uInfo);
  });
});

server.listen(4000);
