var shoe = require('shoe');
var duplexEmitter = require('duplex-emitter');
var uuid = require('node-uuid');

var todos = [];

module.exports =
shoe(function(stream) {
  var client = duplexEmitter(stream);

  client.on('new', function(todo) {
    todo.state = 'pending';
    todo._id = uuid.v4();

    todos.push(todo);
    client.emit('new', todo);
  });

  client.on('remove', function(todoId) {
    console.log('remove', todoId);
    var found = -1, todo, i;
    for(i = 0; i < todos.length && found == -1; i++) {
      todo = todos[i];
      if (todo._id == todoId) found = i;
    }
    if (found < 0) return client.emit('err', 'Couldn\'t find that todo item');
    
    todos.splice(found, 1);

    client.emit('remove', todoId);
  });

  client.on('list', function() {
    client.emit('list', todos);
  });

  client.on('update', function(_todo) {
    var found = -1, todo, i;
    for(i = 0; i < todos.length && found == -1; i++) {
      todo = todos[i];
      if (todo._id == _todo._id) found = i;
    }
    if (found < 0) return client.emit('err', 'Couldn\'t find that todo item');
    todos[found] = _todo;

    client.emit('update', _todo);

  });

});