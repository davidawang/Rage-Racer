var canvas_width = 800;
var canvas_height = 500;
var track_length = 750;
var track_width = 48;
var track_shift = (canvas_width - track_length) / 2;

Object.create = function(o) {
    var F = function() {};
    F.prototype = o;
    return new F();
}

var SERVER = {};
SERVER.runner = {
    alias: "",
    position: 0,
    id: 0,
    color: "",
    face: null,
    isJumping: false,
    create: function(alias,color, face) {
        var o = Object.create(SERVER.runner);
        o.alias = alias;
        o.color = color
        var img = new Image();
        img.src = "http://public.dwang.org/rage/" + face + ".png";
        o.face = img;
        return o;
    }
}
SERVER.speed = 4;
SERVER.currentId;
SERVER.someone_won;
SERVER.who_won;
SERVER.runner_array;
SERVER.hurdle_array;
var runner_radius = track_width / 4;
var jump_constant = 2;

var ctx;

function init() {
    SERVER.runner_array = [];
    SERVER.hurdle_array = [];
    SERVER.someone_won = false;
    SERVER.currentId = 0;
    ctx = document.getElementById('canvas').getContext('2d');

    // Define all of the custom ctx functions
    ctx.fillCircle = function(x, y, radius) {
        var that = this;
        that.beginPath();
        that.arc(x, y, radius, 0, Math.PI*2, true);
        that.fill();
    }
    ctx.strokeCircle = function(x, y, radius) {
        var that = this;
        that.beginPath();
        that.arc(x, y, radius, 0, Math.PI*2, true);
        that.stroke();
    }

    //Tester
    addRunner('Daniel', 'rgb(255,0,0)');
    //addRunner('David', 'rgb(0,255,0)');

    ctx.fillStyle = "#000000";
    
    draw();
}

function draw() {
    clearCanvas();
    drawTracks();
    drawHurdle();
     
    var img = new Image();
    img.src = 'http://public.dwang.org/rage/finish.png';
    ctx.drawImage(img, 760, 0, 40, 500);

    for (var i = 0; i < SERVER.runner_array.length; i++) {
        //drawPositionText(SERVER.runner_array[i], 20 * i);
    }
    
    // FUCK JAVASCRIPT FOR NOT PROPERLY ITERATING THROUGH ARRAY ELEMENTS WITH A FOR-EACH LOOP
    for (var i = 0; i < SERVER.runner_array.length; i++) {
        drawRunner(SERVER.runner_array[i]);
    }
    if (!SERVER.someone_won) {
        for (var i = 0; i < SERVER.runner_array.length; i++) {
            if (SERVER.runner_array[i].position >= track_length) {
                SERVER.who_won = SERVER.runner_array[i].alias;
                ctx.save();
                ctx.fillStyle = '#FF0000';
                ctx.font = '30px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(SERVER.runner_array[i].alias + ' HAS WON!', canvas_width / 2, 
100);
                ctx.restore();
                SERVER.someone_won = true;
            }
        }
    }
    else {
                ctx.save();
                ctx.fillStyle = '#FF0000';
                ctx.font = '30px sans-serif';
                ctx.textAlign = 'center';
     	        ctx.fillText(SERVER.who_won + ' HAS WON!', canvas_width / 2,
100);
                ctx.restore();
    }

}

function drawTracks() {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (var i = 0; i < SERVER.currentId; i++) {
        ctx.moveTo(0 + track_shift, canvas_height - 1 - (i * track_width));
        ctx.lineTo(track_length + track_shift, canvas_height - 1 - (i * track_width));
        ctx.moveTo(0 + track_shift, canvas_height - 1 - ((i + 1) * track_width));
        ctx.lineTo(track_length + track_shift, canvas_height - 1 - ((i + 1) * track_width));
    }
    ctx.stroke();
    ctx.restore();
}

function drawHurdle() {
    var hurdle_width = 2;

    ctx.save();
    ctx.lineWidth = 1;

    ctx.beginPath();
    for (var i = 0; i < SERVER.hurdle_array.length; i++) {
        ctx.moveTo(track_shift + SERVER.hurdle_array[i] - (hurdle_width / 2), canvas_height);
        ctx.lineTo(track_shift + SERVER.hurdle_array[i] - (hurdle_width / 2), canvas_height - (SERVER.currentId * track_width));
        ctx.moveTo(track_shift + SERVER.hurdle_array[i] + (hurdle_width / 2), canvas_height);
        ctx.lineTo(track_shift + SERVER.hurdle_array[i] + (hurdle_width / 2), canvas_height - (SERVER.currentId * track_width));
    }
    ctx.stroke();

    ctx.restore();
}

function drawPositionText(r, y) {
    ctx.save();
    ctx.fillStyle = "#0000FF";
    ctx.font = '15px sans-serif';
    ctx.textBaseline = 'top';
    ctx.fillText(r.alias + ": " + r.position + ", " + r.jumpAlt, 0,y);
    ctx.restore();
}

function run (r) {
    var x = r.position;
    
    r.position = x + SERVER.speed;
    draw();
}

function jump (r) {
    r.isJumping = true;

    // Temporary variables
    r.jumpingUp = true;
    r.jumpRadius = jump_constant;
}

function isFinished(r) {
    return (r.position < track_length) ? false : true;
}

function drawRunner(r) {
    ctx.save();
    ctx.fillStyle = r.color;
    //if (r.isJumping === true) {
    //    if (r.jumpingUp === true)
    //}
    var x_position = r.position + track_shift;
    var y_position = (canvas_height - (r.id * track_width) + canvas_height - ((r.id + 1) * track_width)) / 2
        - ((r.jumpAlt === 'undefined') ? 0 : r.jumpAlt);
    //alert(r.alias + ": " + x_position + "," + y_position);
    //ctx.fillCircle(x_position, y_position, runner_radius);
    ctx.fillStyle = r.color;
    ctx.font = '18px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(r.alias, canvas_width - track_shift - 50, y_position);

    ctx.drawImage(r.face, x_position - 20, y_position - 25, 50, 50);
    
    ctx.restore();
}

function clearCanvas() {
    ctx.clearRect(0,0,canvas_width, canvas_height);
}

// Server methods
function setHurdles (hArray) {
    if (hArray === 'undefined') {
        return;
    }
    SERVER.hurdle_array = hArray;
    draw();
}

function removeRunner (alias) {
    for (var i = 0; i < SERVER.runner_array.length; i++) {
        var r = SERVER.runner_array[i];
        if (r.alias === alias) {
            SERVER.runner_array.splice(i,1);
            draw();
            return;
        }
    }
    alert("User " + alias + "does not exist!");
}

function addRunner(alias, color) {
    var a_runner = SERVER.runner.create(alias, color, SERVER.currentId + 1);
    a_runner.id = SERVER.currentId;
    SERVER.currentId = SERVER.currentId + 1;
    SERVER.runner_array.push(a_runner);
    draw();
}

function checkRunner(username) {
    for (var i = 0; i < SERVER.runner_array.length; i++) {
            var r = SERVER.runner_array[i];
            if (r.alias === username) {
                return true;
            }
        }
    return false;
}


function serverUpdate (username, position, jumpAlt, penalty) {
    var getRunnerByName = function(username) {
        for (var i = 0; i < SERVER.runner_array.length; i++) {
            var r = SERVER.runner_array[i];
            if (r.alias === username) {
                return r;
            }
        }
        alert("Bad username " + username + "!");
    }
    var user = getRunnerByName(username);
    if (position < 0) {
        alert("Position is < 0");
        return;
    }
    user.position = position;

    if (jumpAlt === 'undefined') {
        return;
    }

    user.isJumping = true;
    user.jumpAlt = jumpAlt;

    if (penalty === 'undefined') {
        alert("No penalty given");
    }
    
    user.penalty = penalty; // true/false

    draw();
}

//Socket Ops
var socket = new io.Socket('dev.dwang.org', { 'port': 4000} );
socket.connect();

socket.on('connect', function(){
    //do cool stuff once connected
    alert('Connected.');
    
});

socket.on('message', function(msg){
    //alert(msg['posX'] + ' ' + msg['posY'] + ' ' + msg['isPenalty']);
    //do cool stuff to the message
   setHurdles(msg['hurdleArr']); 
   if (checkRunner(msg['uName'])) {
        serverUpdate(msg['uName'], msg['posX'], msg['posY'], msg['isPenalty']); 
    } else {
        addRunner(msg['uName'], 'rgb(255,0,0)');
    }
});

socket.on('disconnect', function(){
    alert('You have been disconnected from the server.');
});
