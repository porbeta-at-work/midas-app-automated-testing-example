#!/usr/bin/env node

/**
 * Simple Test Recorder
 * Launches Playwright codegen for recording test interactions
 */

const { spawn } = require('child_process');

async function startRecording() {
  console.log('🎬 MiDAS Test Recorder');
  console.log('======================\n');
  console.log('💡 This will open Playwright codegen for recording test interactions');
  console.log('📝 Copy the generated code manually as needed\n');

  const url = process.env.BASE_URL || 'http://midas-webhosting-dev2.s3-website-us-gov-west-1.amazonaws.com';
  
  console.log(`🌐 Target URL: ${url}`);
  console.log('🔄 Starting Playwright codegen...\n');

  // Launch Playwright codegen
  const recorder = spawn('npx', ['playwright', 'codegen', url], {
    stdio: 'inherit',
    shell: true
  });

  recorder.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Recording session completed');
    } else {
      console.log(`❌ Recording session ended with code ${code}`);
    }
  });

  recorder.on('error', (error) => {
    console.error('❌ Failed to start recording:', error.message);
    console.log('💡 Make sure Playwright is installed: npm install @playwright/test');
  });
}

if (require.main === module) {
  startRecording();
}