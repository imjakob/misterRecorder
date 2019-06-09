"use strict";

var fs = require("fs");
var uuid = require("node-uuid");
var videoFileExtension = ".webm";

function writeOrAppendData(data, fileName, ws) {
  var filePath = "./public/uploads/";
  if (!fs.existsSync(filePath + fileName + videoFileExtension)) {
    console.log("writing original file");
    ws.send(fileName);
    fs.writeFileSync(filePath + fileName + videoFileExtension, data);
  } else {
    console.log("appending File");
    fs.appendFileSync(filePath + fileName + videoFileExtension, data);
  }
}

module.exports = function(app) {
  app.ws("/", function(ws, req) {
    var fileName = uuid.v1();
    console.log("new connection established, uuid", fileName);
    ws.on("message", function(data) {
      console.log(data);
      if (data instanceof Buffer) {
        console.log("Its a buffer");
        writeOrAppendData(data, fileName, ws);
      }
      if (data === "DONE") {
        console.log("Got DONE");
        fileName = uuid.v1();
        console.log("New file name:", fileName);

        ws.send(fileName);
      }
    });
    ws.send(fileName);
  });
};
