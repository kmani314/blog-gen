#!/usr/bin/env node
'use strict';

const program = require('commander');
const updater = require('./converter.js');
const regenerator = require('./regen.js');
program 
    .version('0.0')
    .description('blog generation script');

program
    .command('update <filename>').alias('convert')
    .action((filename) => updater.update(filename));
program
	.command('regen <fileToBeReplaced> <newFile>').alias('replace')
	.action((fileToBeReplaced, newFile) => regenerator.regen(fileToBeReplaced, newFile));
program.parse(process.argv);

if(process.argv.length == 2) program.help();
