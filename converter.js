"use strict";
const fs = require('fs');
const colors = require('colors');
const showdown = require('showdown');
const converter = new showdown.Converter();
const path = require('path');
const config = require('./config.json');
const beautify = require('js-beautify').html;
exports.update = function (filename) {
    let getPost = new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8', (err, data) =>{ //read post file
            if(err) reject(err);
            resolve(data);
        });
		
    });
    let getHtml = new Promise((resolve, reject) => {
        fs.readFile(config.target, 'utf8', (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
	
	let getTemplateData = new Promise((resolve, reject) => {
		fs.readFile(config.template, 'utf8', (err, data) => {
			if (err) reject(err);
			resolve(data)
		});
	});
    Promise.all([getPost, getHtml, getTemplateData]).then(([postData, htmlContent, templateData]) => {
		let keyPattern = /^(.+?): (.+?)$/gm;
		let keys;
		let dict = {};
		dict["title"] = `${path.basename(filename, '.md')}`;	
		dict["date"] = `please specify a date in ${filename}`;
		while ((keys = keyPattern.exec(postData)) !== null) {
			dict[keys[1]] = keys[2];
			console.log(dict[keys[1]]);
		}	
		let pattern = /(?<=<!--start-->).*(?=<!--end-->)/gmsi;
		let titlePattern = /(?<=<!--title-->).*(?=<!--date-->)/gmsi;
		let datePattern = /(?<=<!--date-->).*(?=<!--start-->)/gmsi;
		let newHtml = htmlContent.replace(pattern, converter.makeHtml(postData));
		newHtml = newHtml.replace(titlePattern, converter.makeHtml('#' + dict["title"]));
		newHtml = newHtml.replace(datePattern, converter.makeHtml('###' + dict["date"]));
		let standAlonePageHtml = templateData.replace(pattern, converter.makeHtml(postData));
		standAlonePageHtml = standAlonePageHtml.replace(titlePattern, converter.makeHtml('#' + dict["title"]));
		standAlonePageHtml = standAlonePageHtml.replace(datePattern, converter.makeHtml('###' + dict["date"]));

		return new Promise((resolve, reject) => {
			fs.writeFile(`${dict["title"].replace(/ /g, '_')}.html`, beautify(standAlonePageHtml), 'utf8', (err) => {
				if(err) reject(err);
			});
			fs.writeFile(config.target, beautify(newHtml), 'utf8', (err) => {
				if (err) reject(err);
			});
			resolve(dict);
		});
	}).then((dict) => { 
		console.log(`Success writing to ${config.target}`.green);
		console.log(`Now reading from ${config.post_list_filename}`.blue);

		return new Promise((resolve, reject) => {
			fs.readFile(config.post_list_filename, 'utf8', (err, data) => {
				if (err) reject(err);
				let array = [data, dict];
				resolve(array);
			});
		});
	
	
	}).then((array) => {
		console.log(`Success reading ${config.post_list_filename}`.green);
		console.log(`Preparing to write to ${config.post_list_filename}`.blue);

		let pattern = /(?=<!--HEAD-->)/gm;
		let updatedAllPostsPage = array[0].replace(pattern, `\n<div class="linklist"><a class="linklist" href=\"${config.posts_folder}${array[1]["title"].replace(/ /g, '_')}.html">» ${array[1]["title"]} </a> »» ${array[1]["date"]}</div>\n`);

		return new Promise((resolve, reject) => {
			fs.writeFile(config.post_list_filename, beautify(updatedAllPostsPage), 'utf8', (err) => {
				if (err) reject(err);
				resolve();
			});
		});
	
	});
}
