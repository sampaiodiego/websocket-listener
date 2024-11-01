const WebSocket = require('ws');

const {
	LOGIN_TOKEN: loginToken,
	DEBUG,
} = process.env;

const host = process.env.HOST_URL;
const wsUrl = host ? `wss://${host}/websocket` : process.env.URL;

if (!wsUrl) {
	throw new Error('No URL or HOST defined.');
}

const log = (...args) => {
	console.log(new Date().toISOString(), ...args);
};

const debug = DEBUG === 'true' ? (...args) => {
	console.log(new Date().toISOString(), ...args);
} : () => {};

const error = (...args) => {
	console.error(new Date().toISOString(), ...args);
};

function websocketListener(url) {
	const ws = new WebSocket(url);

	ws.on('open', () => log('connected'));

	ws.on('connection', () => log('connected'));

	ws.on('error', (err) => {
		error('ERROR', err);
		ws.removeAllListeners();
		setTimeout(() => websocketListener(url), 5000);
	});

	// ws.onerror((...err) => { error('onerror', ...err); });
	// ws.onclose((...args) => { log('onclose', ...args); });
	ws.on('close', (code, reason) => {
		error('CLOSE', code, reason.toString());
		ws.removeAllListeners();
		setTimeout(() => websocketListener(url), 5000);
	});

	ws.on('open', function open() {
		ws.send('{"msg":"connect","version":"1","support":["1","pre2","pre1"]}');

		if (loginToken) {
			ws.send('{"msg":"method","id":"1","method":"login","params":[{"resume":"' + loginToken + '"}]}');
		}
	});

	ws.on('message', function message(data) {
		debug('<-', data.toString(), data.indexOf('ping'));

		if (data.indexOf('ping') > -1) {
			ws.send('{"msg":"pong"}');
		}
	});
}

websocketListener(wsUrl);
