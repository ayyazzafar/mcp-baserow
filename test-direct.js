#!/usr/bin/env node

// Direct test script for Baserow MCP server
// Works with any MCP-compatible client
import { spawn } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Start the MCP server
const server = spawn('node', ['dist/index.js'], {
  stdio: ['pipe', 'pipe', 'inherit'],
  env: { ...process.env }
});

let buffer = '';

server.stdout.on('data', (data) => {
  buffer += data.toString();
  
  // Try to parse complete JSON-RPC messages
  const lines = buffer.split('\n');
  buffer = lines.pop() || '';
  
  for (const line of lines) {
    if (line.trim()) {
      try {
        const response = JSON.parse(line);
        console.log('\n📥 Response:', JSON.stringify(response, null, 2));
      } catch (e) {
        console.log('📄 Output:', line);
      }
    }
  }
});

// Helper to send JSON-RPC requests
function sendRequest(method, params = {}) {
  const request = {
    jsonrpc: '2.0',
    id: Date.now(),
    method,
    params
  };
  
  console.log('\n📤 Request:', JSON.stringify(request, null, 2));
  server.stdin.write(JSON.stringify(request) + '\n');
}

// Test sequence
async function runTests() {
  console.log('🚀 Baserow MCP Server Test Runner\n');
  
  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 1. Initialize
  console.log('\n1️⃣ Initializing connection...');
  sendRequest('initialize', {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'test-client', version: '1.0.0' }
  });
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 2. List available tools
  console.log('\n2️⃣ Listing available tools...');
  sendRequest('tools/list');
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 3. Check auth status
  console.log('\n3️⃣ Checking authentication status...');
  sendRequest('tools/call', {
    name: 'baserow_auth_status',
    arguments: {}
  });
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 4. List workspaces
  console.log('\n4️⃣ Listing workspaces...');
  sendRequest('tools/call', {
    name: 'baserow_list_workspaces',
    arguments: {}
  });
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('\n✅ Basic tests completed! Press Ctrl+C to exit.');
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down test runner...');
  server.kill();
  process.exit(0);
});

// Run tests
runTests().catch(console.error);