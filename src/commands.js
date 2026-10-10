const { simple, error, bulk } = require('./resp');

const store = new Map();

function execute(args) {
  const cmd = args[0].toUpperCase();

  switch (cmd) {
    case 'PING':
      return args[1] ? bulk(args[1]) : simple('PONG');

    case 'SET':
      if (args.length < 3) return error("ERR wrong number of arguments for 'set' command");
      store.set(args[1], args[2]);
      return simple('OK');

    case 'GET':
      if (args.length !== 2) return error("ERR wrong number of arguments for 'get' command");
      return bulk(store.has(args[1]) ? store.get(args[1]) : null);

    default:
      return error(`ERR unknown command '${args[0]}'`);
  }
}

module.exports = { execute };