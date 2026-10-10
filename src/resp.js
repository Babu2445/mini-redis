const CRLF = '\r\n';

function parseCommand(buf) {
  if (buf.length === 0) return null;

  // Inline command (nc/telnet): "PING\r\n"
  if (buf[0] !== 0x2a) {
    const end = buf.indexOf(CRLF);
    if (end === -1) return null;
    const line = buf.toString('utf8', 0, end).trim();
    return { args: line ? line.split(/\s+/) : [], consumed: end + 2 };
  }

  // RESP array: *<count>\r\n$<len>\r\n<data>\r\n
  let pos = buf.indexOf(CRLF);
  if (pos === -1) return null;
  const count = parseInt(buf.toString('utf8', 1, pos), 10);
  pos += 2;

  const args = [];
  for (let i = 0; i < count; i++) {
    const lenEnd = buf.indexOf(CRLF, pos);
    if (lenEnd === -1) return null;
    const len = parseInt(buf.toString('utf8', pos + 1, lenEnd), 10);
    const start = lenEnd + 2;
    if (buf.length < start + len + 2) return null;
    args.push(buf.toString('utf8', start, start + len));
    pos = start + len + 2;
  }
  return { args, consumed: pos };
}

const simple = (s) => `+${s}\r\n`;
const error = (s) => `-${s}\r\n`;
const integer = (n) => `:${n}\r\n`;
const bulk = (s) =>
  s === null ? '$-1\r\n' : `$${Buffer.byteLength(s)}\r\n${s}\r\n`;

module.exports = { parseCommand, simple, error, integer, bulk };