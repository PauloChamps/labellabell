#!/usr/bin/env node
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../dist');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8'};
const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  let file = path.join(root, pathname);
  if (pathname.endsWith('/')) file = path.join(file, 'index.html');
  if (!file.startsWith(root)) { response.writeHead(403); return response.end('Acesso negado'); }
  fs.readFile(file, (error, data) => {
    if (error) { response.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'}); return response.end('Não encontrado'); }
    response.writeHead(200, {'Content-Type':types[path.extname(file)] || 'application/octet-stream'}); response.end(data);
  });
});
server.listen(4173, '127.0.0.1', () => console.log('Prévia em http://127.0.0.1:4173/'));
