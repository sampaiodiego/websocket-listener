import { WebSocketServer } from 'ws';

const port = process.env.PORT || 8080;

const wss = new WebSocketServer({ port });

wss.on('connection', function connection(ws) {
	ws.isAlive = true;
	ws.on('error', console.error);

	ws.on('message', function message(data) {
		if (data.toString() === '{"msg":"pong"}') {
			ws.isAlive = true;
		}
	});

  	ws.send('{"server_id":"69"}');
});

setInterval(function ping() {
	wss.clients.forEach(function each(ws) {
		if (ws.isAlive === false) {
			return ws.terminate();
		}

		ws.isAlive = false;
		ws.send('{"msg":"ping"}');
	});
}, 30000);
