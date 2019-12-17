const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const fsPromise = fs.promises;

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
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw (`Error reading directory ${exports.dataDir}`);
      return;
    }
    files = _.map(files, (file) => {
      /*
        Expermential Node function
        reads the file content using Async (Promise Based)
      */
      return fsPromise.readFile(path.join(exports.dataDir, file))
        .then((text)=>{
          return {
            id: file.split('.')[0],
            text: text.toString()
          };
        });
    });

    // Wait for all Promises to resolve
    Promise.all(files).then((values) => {
      callback(err, values);
    });
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
