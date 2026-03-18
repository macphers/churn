#!/usr/bin/env node

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.dirname(__dirname);
const OUTPUT_ROOT = path.join(ROOT, 'output');
const HOST = '127.0.0.1';
const DEFAULT_PORT = 3000;
const MAX_PORT_ATTEMPTS = 10;

const CONTENT_TYPES = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.gif', 'image/gif'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'application/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.woff2', 'font/woff2']
]);

function parseArgs(argv) {
  let openBrowser = false;
  let requestedPort = Number(process.env.PORT) || DEFAULT_PORT;
  let strictPort = false;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--open') {
      openBrowser = true;
      continue;
    }
    if (arg === '--port') {
      requestedPort = Number(argv[i + 1]);
      strictPort = true;
      i += 1;
    }
  }

  if (!Number.isInteger(requestedPort) || requestedPort <= 0) {
    throw new Error(`Invalid port: ${requestedPort}`);
  }

  return { openBrowser, requestedPort, strictPort };
}

function contentTypeFor(filePath) {
  return CONTENT_TYPES.get(path.extname(filePath).toLowerCase()) || 'application/octet-stream';
}

function resolveOutputPath(urlPath) {
  const pathname = new URL(urlPath, `http://${HOST}`).pathname;
  if (pathname === '/' || pathname === '/index.html') {
    return path.join(OUTPUT_ROOT, 'index.html');
  }

  let relativePath = pathname.replace(/^\/+/, '');
  if (relativePath.startsWith('output/')) {
    relativePath = relativePath.slice('output/'.length);
  }

  const resolved = path.resolve(OUTPUT_ROOT, relativePath);
  const safeRoot = `${path.resolve(OUTPUT_ROOT)}${path.sep}`;
  if (resolved !== path.resolve(OUTPUT_ROOT) && !resolved.startsWith(safeRoot)) {
    return null;
  }

  return resolved;
}

function maybeOpenBrowser(url) {
  const platform = process.platform;
  if (platform === 'darwin') {
    spawn('open', [url], { stdio: 'ignore', detached: true }).unref();
    return;
  }
  if (platform === 'win32') {
    spawn('cmd', ['/c', 'start', '', url], { stdio: 'ignore', detached: true }).unref();
    return;
  }
  spawn('xdg-open', [url], { stdio: 'ignore', detached: true }).unref();
}

function createServer() {
  return http.createServer((req, res) => {
    const resolvedPath = resolveOutputPath(req.url || '/');
    if (!resolvedPath) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    fs.readFile(resolvedPath, (error, content) => {
      if (error) {
        res.writeHead(error.code === 'ENOENT' ? 404 : 500);
        res.end(error.code === 'ENOENT' ? 'File not found.' : 'Internal server error.');
        return;
      }

      res.writeHead(200, {
        'Content-Length': content.length,
        'Content-Type': contentTypeFor(resolvedPath)
      });
      res.end(content);
    });
  });
}

async function listen(server, port) {
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, HOST, () => {
      server.removeListener('error', reject);
      resolve();
    });
  });
}

async function main() {
  const { openBrowser, requestedPort, strictPort } = parseArgs(process.argv.slice(2));
  const server = createServer();
  const maxAttempts = strictPort ? 1 : MAX_PORT_ATTEMPTS;

  for (let offset = 0; offset < maxAttempts; offset += 1) {
    const port = requestedPort + offset;
    try {
      await listen(server, port);
      const url = `http://${HOST}:${port}/`;
      console.log(`Churn app → ${url}`);
      console.log('Mission Control remains available via npm run dev:tool');
      if (openBrowser) {
        maybeOpenBrowser(url);
      }
      return;
    } catch (error) {
      if (error.code !== 'EADDRINUSE') {
        throw error;
      }
    }
  }

  if (strictPort) {
    throw new Error(`Port ${requestedPort} is already in use.`);
  }

  throw new Error(`Could not find an open port starting at ${requestedPort}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
