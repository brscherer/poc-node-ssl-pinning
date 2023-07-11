const https = require('https');

// certificate fingerprints of domain
const FINGERPRINTSET = [
  'invalid:fingerprint',
  '42:3C:C1:E5:66:64:F5:19:26:2E:09:D8:3C:88:31:21:9E:BE:2D:DE'
];

const options = {
  hostname: 'api.github.com',
  port: 443,
  path: '/',
  method: 'GET',
  headers: {
    'User-Agent': 'Node.js/https'
  },
  //disable session caching, performing certificate handshake on every request
  agent: new https.Agent({
    maxCachedSessions: 0
  })
};

const req = https.request(options, res => {
  res.on('data', d => {
    process.stdout.write(d);
  });
})
.on('error', e => {
  console.error(e);
});

// Emitted as soon as a socket is assigned to the request, but don't have certificate yet
req.on('socket', socket => {
  // Get certificate information after successful handshake is made and `secureConnect` event is emitted 
  socket.on('secureConnect', () => {
    const fingerprint = socket.getPeerCertificate().fingerprint;

    // Check if certificate is valid
    if(socket.authorized === false){
      req.emit('error', new Error(socket.authorizationError));
      return req.destroy();
    }

    // Match the fingerprint with our saved fingerprints
    if(FINGERPRINTSET.indexOf(fingerprint) === -1){
      // Abort request, optionally emit an error event
      req.emit('error', new Error('Fingerprint does not match'));
      return req.destroy();
    }
  });
});

req.end();
