const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

/**
 * Helper functions
 */

const readDirectory = (location, callback = ()=> {}) => {
  fs.readdir(location, (err, files) => {
    if (err) {
      throw (`Error reading directory ${location}`);
      return;
    }
    callback(err, files);
  });
};

const readSomething = (location, name, callback) => {
  fs.readFile(location + `/${name}.txt`, (err, data) => {
    if (err) {
      callback(err);
      return;
    }
    callback(err, data);
  });
};

const writeSomething = (location, name, content, callback = ()=> {})=> {
  fs.writeFile(location + `/${name}.txt`, content, (err)=> {
    if (err) {
      throw (`Error saving todo id: ${name} text: ${content}`);
      return;
    }
    callback(name, content);
  });
};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id)=>{
    if (err) {
      throw ('Error creating ID on @ create()');
      return;
    }
    // Create todo file
    fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
      if (err) {
        callback(err, null);
      }
      callback(null, {id, text});
    });
  });
};

exports.readAll = (callback) => {
  readDirectory(exports.dataDir, (err, files) => {
    files = _.map(files, (file) => {
      return {
        id: file.split(/\./)[0],
        text: file.split(/\./)[0]
      };
    });
    callback(null, files);
  });
};

exports.readOne = (id, callback) => {
  readSomething(exports.dataDir, id, (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
      return;
    }
    console.log({id, data: data.toString()});
    callback(null, { id, text: data.toString() });
  });

  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
