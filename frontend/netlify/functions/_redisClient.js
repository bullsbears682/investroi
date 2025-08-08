let client = null;

async function getRedis() {
  if (client) return client;
  const url = process.env.REDIS_URL || '';
  if (url) {
    const { createClient } = require('redis');
    client = createClient({ url });
    client.on('error', (err) => console.error('Redis Client Error', err));
    await client.connect();
    return client;
  }
  return null;
}

module.exports = { getRedis };