### blog-generator

This is a script that generates my blog from markdown files. 

Note: This is an old-ish project (mid 2018), from when I didn't really know Node that well. The code is kind of bad and doesn't have any comments.

There are two main commands:

```
blog-gen update|convert <filename>
```
This takes the template.html file specified in the config, copies that into a new file, adds the markdown converted to HTML with ShowdownJS, and then adds a link 
to the post in the all posts page specified in the config.

In the markdown file, make sure you have a title and a date specified in the form:

```
<!-- (The HTML comments make sure Showdown ignores this) 
title: your-title-goes-here
date: your-date-goes-here
-->
```
```
blog-gen regen|replace <file-to-be-replaced> <newfile>
```
This replaces an old post using a new markdown file, in case you wanted to edit an older post.

The config.json file specifies all of the files required for the generator.
"target" : front page of blog
"template" : template that generates post archive pages
"post_list_filename" : the page that has links to all pages
"post_folder" : the folder that has the posts in them (if you don't want this, just put a period)

