const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

const io = require('socket.io')(server);
const path = require('path');

app.use(express.static(path.join(__dirname,'./public')));

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

const COMMAND_PREFIX = "!";
const COMMAND_RESPONDER = "[SYSTEM]";

const nameRegex = /^[A-Za-z0-9]{2,16}$/;

let name;

io.on('connection', (socket) => {
    console.log('new user connected');
    
    socket.on('joining msg', (username) => {
    	name = username;
		socket.name = name;
		
		let dupeCount = 0;
		
		io.of('/').sockets.forEach(s => {
			if(s.name === socket.name) dupeCount++;
		});

        if(nameRegex.test(name) && dupeCount === 1) {
            console.log(`${name} has connected.`);
    	    io.emit('chat message', `   ${name} joined.`);
        } else {
            socket.killed = true;
            socket.disconnect();
            console.log(`User tried to join with the name '${name}' which was determined to be invalid.`);
        }
    });

    socket.on('disconnect', () => {
		if(!socket.killed) {
			console.log(`${name} has disconnected.`);
			io.emit('chat message', `   ${name} left.`);
		}
    });

    socket.on('chat message', (msg) => {
        socket.broadcast.emit('chat message', `${socket.name}: ${msg}`);

        if(msg && msg.startsWith(COMMAND_PREFIX)) {
            let response;

            switch(msg.replace(COMMAND_PREFIX, "").split(" ")[0]) {
                case "users":
                    let names = [];

                    io.of('/').sockets.forEach(s => {
                        names.push(s.name);
                    });

                    response = `Online (${names.length}): ${names.join(", ")}`;

                    socket.broadcast.emit('chat message', `${COMMAND_RESPONDER}: ${response}`);
                    socket.emit('chat message', `${COMMAND_RESPONDER}: ${response}`);
                    break;
            }
        }
    });
});

server.listen(3000, () => {
    console.log('OnionChat listening on port 3000.');
});
