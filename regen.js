"use strict";

const fs = require('fs');
const showdown = require('showdown');
const converter = new showdown.Converter();
const path = require('path');
const config = require('./config.json');
const beautify = require('js-beautify').html;
exports.regen = function (fileToBeReplaced, newFile) {
	let getAllPostsPageData = new Promise((resolve, reject) => {
		fs.readFile(config.post_list_filename, 'utf8', (err, data) => {
			if (err) reject(err);
			resolve(data);
		});
	});
	let deleteOldFile = new Promise((resolve, reject) => {
		fs.unlink(fileToBeReplaced, (err) => {
			if (err) reject(err);
			resolve();
		});
	
	});
	let readTemplate = new Promise((resolve, reject) => {
		fs.readFile(config.template, 'utf8', (err, data) => {
			if (err) reject(err);
			resolve(data);
		});
	});
	let readPost = new Promise((resolve, reject) => {
		fs.readFile(newFile, 'utf8', (err, data) => {
			if (err) reject(err);
			resolve(data);
		});
	});
	Promise.all([getAllPostsPageData, readPost, readTemplate, deleteOldFile]).then(([allPostsPageData, postData, templateData]) => {
		
		let keyPattern = /^(.+?): (.+?)$/gm;
		let keys;
		let dict = {};
		dict["title"] = `${path.basename(newFile, '.md')}`;
		dict["date"] = `please specify a date in ${newFile}`;
		while ((keys = keyPattern.exec(postData)) !== null) {
			dict[keys[1]] = keys[2];
			console.log(dict[keys[1]]);
		}
		
		let match = '.*' + path.basename(fileToBeReplaced) + '.*'
		let allPattern = new RegExp(match, 'g');
		let newAllHtml = allPostsPageData.replace(allPattern, `\n<div class="linklist"><a class="linklist" href=\"${config.posts_folder}${dict["title"].replace(/ /g, '_')}">» ${dict["title"]} </a> »» ${dict["date"]}</div>\n`);

		let postPattern = /(?<=<!--start-->).*(?=<!--end-->)/gmsi;
		
		let newPostHtml = templateData.replace(postPattern, converter.makeHtml(postData));
		let titlePattern = /(?<=<!--title-->).*(?=<!--date-->)/gmsi;
        let datePattern = /(?<=<!--date-->).*(?=<!--start-->)/gmsi;
        newPostHtml = newPostHtml.replace(titlePattern, converter.makeHtml('#' + dict["title"]));
        newPostHtml = newPostHtml.replace(datePattern, converter.makeHtml('###' + dict["date"]));
		return new Promise((resolve, reject) => {
			fs.writeFile(config.post_list_filename, beautify(newAllHtml), 'utf8', (err) => {
				reject(err);
			});
			fs.writeFile(`${dict["title"].replace(/ /g, '_')}.html`, beautify(newPostHtml), (err) => {
				reject(err);
			});
			resolve();
		});
	});

}
