#!/bin/sh

if [[ $MODE == 'server' ]]; then
	node server.js
else
	node index.js
fi;
