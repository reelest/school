import ReconnectingWebSocket from 'reconnecting-websocket';
import {Connection} from 'sharedb/lib/client';


var socket = new ReconnectingWebSocket('ws://localhost:8787', [], {
  // ShareDB handles dropped messages, and buffering them while the socket
  // is closed has undefined behavior
  maxEnqueuedMessages: 0
});

var connection = new Connection(socket);

var doc = connection.get('doc-collection', 'doc-id');

doc.subscribe((error) => {
  if (error) return console.error(error)

  // If doc.type is undefined, the document has not been created, so let's create it
  if (!doc.type) {
    doc.create({counter: 0}, (error) => {
      if (error) console.error(error)
    })
  }
  
  alert(doc);
});

doc.on('op', (op) => {
  console.log('count', doc.data.counter)
});

window.increment = () => {
  // Increment the counter by 1
  doc.submitOp([{p: ['counter'], na: 1}])
};

