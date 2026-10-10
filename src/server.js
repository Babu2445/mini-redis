const net = require('net');
const { parseCommand, error } = require('./resp');
const { execute } = require('./commands');

const PORT = 6380;

const server = net.createServer((socket) => {
  let buffer = Buffer.alloc(0);

  socket.on('data', (chunk) => {
    buffer = Buffer.concat([buffer, chunk]);

    while (true) {
      const parsed = parseCommand(buffer);
      if (!parsed) break;
      buffer = buffer.subarray(parsed.consumed);
      if (parsed.args.length === 0) continue;

      try {
        socket.write(execute(parsed.args));
      } catch (e) {
        socket.write(error('ERR ' + e.message));
      }
    }
  });

  socket.on('error', () => {});
});

server.listen(PORT, () => console.log(`mini-redis listening on ${PORT}`));