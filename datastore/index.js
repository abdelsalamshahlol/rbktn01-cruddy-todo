const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};
/**
 * Helper functions
 */

const readSomething = ()=> {

};

const writeSomething = (location, name, content, callback = ()=> {})=> {
  fs.writeFile(location + `/${name}.txt`, content, (err)=> {
    if (err) {
      throw (`Error saving todo id: ${name} text: ${content}`);
    }
    // callback(name, content);
  });
};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id)=>{
    if (err) {
      throw ('Error creating ID on @ create()');
      return;
    }
    // console.log({id, text, items});
    items[id] = text;

    // Create todo file
    writeSomething(exports.dataDir, id, text, (id, text)=> console.log(`writing ${id} ${text} to disk`));
    callback(null, { id, text});
  });
};

exports.readAll = (callback) => {
  var data = _.map(items, (text, id) => {
    return { id, text };
  });
  callback(null, data);
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
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
