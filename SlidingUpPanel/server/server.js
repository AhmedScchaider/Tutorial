/**
* Copyright 2016 Nerdiex All rights reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';
var fs = require('fs'),
    express = require('express'),
    app = express(),
    path = require('path');

var data = [];
readFiles(__dirname+'/../client/songs/', function(filename, content) {
    data.push('http://localhost:3000/songs/' +filename);
}, function(err) {
    throw err;
});
function readFiles(dirname, onFileContent, onError) {
    fs.readdir(dirname, function(err, filenames) {
        if (err) {
            onError(err);
            return;
        }
        filenames.forEach(function(filename) {
            fs.readFile(dirname + filename, 'utf-8', function(err, content) {
                if (err) {
                    onError(err);
                    return;
                }
                onFileContent(filename, content);
            });
        });
    });
}
app.use(function (req, res, next) {
    var filename = req.url || "client/index.html";
    var ext = path.extname(filename);
    var localPath = __dirname + '/../client';
    var validExtensions = {
        ".html" : "text/html",          
        ".js": "application/javascript",
        ".json": "application/json",  
        ".css": "text/css",
        ".txt": "text/plain",
        ".jpg": "image/jpeg",
        ".gif": "image/gif",
        ".png": "image/png",
        ".ico": "image/png",
        ".svg": "image/svg+xml",
        ".webm": "audio/webm",
        ".aac": "audio/aac",
        ".ogg": "audio/ogg",
        ".wav": "audio/wav",
        ".mp3": "audio/mpeg",
        ".mp4": "audio/mp4",
        ".m4a": "audio/mp4"
    };
    
    var isValidExt = validExtensions[ext];
    
    if (isValidExt) {
        localPath += filename;
        console.log(localPath);
        fs.exists(localPath, function(exists) {
            if(exists) {
                console.log("Serving file: " + localPath);
                getFile(localPath, res, validExtensions[ext]);
            } else {
                console.log("File not found: " + localPath);

                if(ext === 'text/html'){
                    getFile(__dirname + '/404.html', res, validExtensions[ext]);
                }
            }
        });

    } else if(req.url == "/songlist"){
        res.setHeader("Content-Type", 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify(data));
    }else {
         console.log("Invalid file extension detected: " + ext);
         getFile(__dirname + '/../client/index.html', res, 'text/html');
    }
});
app.listen(3000);
function getFile(localPath, res, mimeType) {
    fs.readFile(localPath, function(err, contents) {
        if(!err) {
            res.setHeader("Content-Length", contents.length);
            res.setHeader("Content-Type", mimeType);
            res.statusCode = 200;
            res.end(contents);
        } else {
            res.writeHead(500);
            res.end();
        }
    });
}