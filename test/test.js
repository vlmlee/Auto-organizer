var file = './test.txt';
var fs = require('fs');

var contents = fs.readFile(file, 'utf8', function(err, content) {
    var postTitle = new RegExp('\<.*?\>', 'g').exec(content)[0].removeCharContainers();
    var postBlob = postTitle.split(' ').join('-');
    var postBody = new RegExp('\{.*?\}', 'g').exec(content)[0].removeCharContainers();
    var postDate = Date.now();

    console.log(postDate);
});

String.prototype.removeCharContainers = function() {
    return this.slice(1, -1).trim();
}
