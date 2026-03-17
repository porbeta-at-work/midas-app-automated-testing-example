#!/usr/bin/env node

/**
 * Test Recorder CLI
 * Easy-to-use command line interface for the test recorder
 */

const TestRecorder = require('./test-recorder');

async function startRecording() {
  console.log('🎬 MiDAS Test Recorder');
  console.log('======================\n');

  const recorder = new TestRecorder();
  
  // Default options for MiDAS
  const options = {
    headless: false, // Always show browser for recording
    url: process.env.BASE_URL || 'http://midas-webhosting-dev2.s3-website-us-gov-west-1.amazonaws.com',
    recordingName: `midas-recording-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}`
  };

  try {
    await recorder.startRecording(options);

    // Handle Ctrl+C gracefully
    process.on('SIGINT', async () => {
      console.log('\n📡 Stopping recording...');
      await recorder.stopRecording();
      process.exit(0);
    });

    // Keep process alive
    setInterval(() => {}, 1000);
  } catch (error) {
    console.error('❌ Recording failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  startRecording();
}