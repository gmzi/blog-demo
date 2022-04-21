const fs = require('fs');
const path = require('path');
const util = require('util')

const data = require(path.join(process.cwd(), './lib/data-sample.js'));
// const text = require(path.join(process.cwd(), './lib/data-sample.json'));

const BASE_URL = process.env.BASE_URL;

fs.writeFileSync(process.cwd() + '/lib/data.js', "import languages from './languages.json'");
fs.appendFileSync(process.cwd() + '/lib/data.js', '\nexport const data = ');
fs.appendFileSync(process.cwd() + '/lib/data.js', util.inspect(data));
fs.appendFileSync(process.cwd() + '/lib/data.js', '\nexport const text = languages["EN"]');

console.log('ready to go')

