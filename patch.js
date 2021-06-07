const fs = require('fs')
const file = './node_modules/@angular-devkit/build-angular/src/webpack/configs/browser.js';
//此处为angular6的路径配置
//angular4的路径配置为:./node_modules/@angular/cli/models/webpack-configs/browser.js

fs.readFile(file, 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  
  var result = data.replace(/node: false/g, 'node: {crypto: true, stream: true}');

  fs.writeFile(file, result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});