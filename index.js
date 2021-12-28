var fs = require('fs');
var request = require('request');
var path = require('path');
const download = require('download');

if (!process.argv[2]) {
  var filename = "./manifest.json";
} else {
  var filename = process.argv[2];
}

fs.readFile(filename, 'utf8', function (err, data) {
  if (err) {
    console.log('\x1b[91m%s\x1b[0m', "===== An error has occured, maybe manifest.json doesn't exist in this directory? =====");
    throw err;
  } else {
    console.log('OK: ' + filename);
    var files = JSON.parse(data).files;
    files.forEach(element => {
      var url = 'https://addons-ecs.forgesvc.net/api/v2/addon/' + element.projectID + '/file/' + element.fileID + '/download-url';
      request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var file = body;
          const filePath = `${__dirname}/mods`;
          download(file, filePath)
            .then(() => {
              console.log('Download Completed: ' + path.basename((new URL(body)).pathname));
            })
        } else {
          console.log("Error " + response.statusCode)
        }
      })
    });
  }
});