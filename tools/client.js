const net = require('net');
const args = process.argv.slice(2);
const msg =
  `*${args.length}\r\n` +
  args.map((a) => `$${Buffer.byteLength(a)}\r\n${a}\r\n`).join('');

const s = net.connect(6380, '127.0.0.1', () => s.write(msg));
s.on('data', (d) => {
  console.log(JSON.stringify(d.toString()));
  s.end();
});
s.on('error', (e) => console.log('Error:', e.message));