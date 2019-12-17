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
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, content) => {
    if (err) {
      return callback(new Error(`No item with id: ${id}`));
    }
    callback(null, {id, text: content.toString()});
  });
};

exports.update = (id, text, callback) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, content)=> {
    if (err) {
      return callback(new Error(`No item with id: ${id}`));
    }
    fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
      if (err) {
        return callback(new Error(`No item with id: ${id}`));
      }
      callback(null, { id, text });
    });
  });
};

exports.delete = (id, callback) => {
  fs.unlink(path.join(exports.dataDir, `${id}.txt`), (err)=>{
    if (err) {
      return callback(new Error(`No item with id: ${id}`));
    }
    callback();
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
