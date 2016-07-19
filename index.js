var fs = require('fs'),
    events = require('events'),
    util = require('util'),
    path = require('path'),
    junk = require('junk');

var config = require('./config.json'),
    workingDir = './save/',
    rootDir = './';

util.inherits(Watcher, events.EventEmitter);

function Watcher(workingDir) {
    this.workingDir = workingDir;
}

Watcher.prototype.watch = function() {
    var watcher = this;
    fs.readdir(this.workingDir, function(err, unfilteredFiles) {
        if (err) throw err;
        var files = unfilteredFiles.filter(junk.not);
        // Filters out .DS_STOREs and other unwanted files
        for (var index in files) {
            watcher.emit('organize', files[index]);
        }
    });
};

Watcher.prototype.start = function() {
    var watcher = this;
    fs.watch(this.workingDir, function() {
        watcher.watch();
    });
};

var watcher = new Watcher(workingDir);

watcher.on('organize', function organize(file) {
    var watchFile = path.join(workingDir, file);
    var fileNameArray = file.split('.');

    if (fileNameArray.length > 2) {
        var fileExt = '';
        for (var i = 1; i < fileNameArray.length; i++) {
            fileExt = '.' + fileNameArray[fileNameArray.length - i] + fileExt;
        }
    } else {
        fileExt = '.' + fileNameArray.pop();
    }

    var destination = path.join(rootDir, config[fileExt], file);

    fs.rename(watchFile, destination, function(err) {
        if (err == 'ENOENT') {
            throw new Error('Directory does not exist for that file extension.');
        }
    });
});

watcher.start();
