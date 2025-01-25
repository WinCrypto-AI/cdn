
const actions = require('./actions');
const myArgs = process.argv.slice(2);
const forderPath = myArgs[0];

console.log('forderPath: ', forderPath);
const { createIndexByFolder } = actions;

createIndexByFolder(forderPath);