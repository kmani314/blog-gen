#!/usr/bin/env node
const fs = require('fs');
const showdown = require('showdown');

new Promise((resolve, reject) => {
    fs.readdir('/Users/Krishna/kmani.me/', (err, data) => {
        if (err) reject();
		resolve(data);
    });
}).then(data => {
	console.log(data);
}).catch(() =>  {
	console.log('error');
});


