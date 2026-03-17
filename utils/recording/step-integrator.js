const fs = require('fs');
const path = require('path');

/**
 * Helper utility to integrate recorded step definitions into existing test files
 */
class StepIntegrator {
  constructor() {
    this.recordingsDir = './recordings';
    this.stepDefsDir = './step-definitions';
  }

  /**
   * List all available recordings
   */
  async listRecordings() {
    try {
      const recordings = await fs.promises.readdir(this.recordingsDir);
      return recordings.filter(dir => 
        fs.existsSync(path.join(this.recordingsDir, dir, 'generated-steps.js'))
      );
    } catch (error) {
      console.log('No recordings found');
      return [];
    }
  }

  /**
   * Import step definitions from a recording
   */
  async importSteps(recordingName, targetFile = 'recorded-steps.js') {
    const sourcePath = path.join(this.recordingsDir, recordingName, 'generated-steps.js');
    const targetPath = path.join(this.stepDefsDir, targetFile);

    if (!fs.existsSync(sourcePath)) {
      throw new Error(`Recording not found: ${recordingName}`);
    }

    // Read generated steps
    const generatedSteps = await fs.promises.readFile(sourcePath, 'utf8');
    
    // Check if target file exists
    if (fs.existsSync(targetPath)) {
      // Append to existing file
      const existingContent = await fs.promises.readFile(targetPath, 'utf8');
      const newContent = existingContent + '\n\n// Imported from: ' + recordingName + '\n' + 
                        this.extractStepDefinitions(generatedSteps);
      await fs.promises.writeFile(targetPath, newContent);
      console.log(`✅ Step definitions appended to existing ${targetFile}`);
    } else {
      // Create new file
      await fs.promises.writeFile(targetPath, generatedSteps);
      console.log(`✅ Step definitions created in new file: ${targetFile}`);
    }

    return targetPath;
  }

  /**
   * Import feature scenario from recording 
   */
  async importFeature(recordingName, targetFile = 'recorded-scenarios.feature') {
    const sourcePath = path.join(this.recordingsDir, recordingName, 'generated-scenario.feature');
    const targetPath = path.join('./features', targetFile);

    if (!fs.existsSync(sourcePath)) {
      throw new Error(`Recording feature not found: ${recordingName}`);
    }

    const generatedFeature = await fs.promises.readFile(sourcePath, 'utf8');

    if (fs.existsSync(targetPath)) {
      // Append scenario to existing feature file
      const existingContent = await fs.promises.readFile(targetPath, 'utf8');
      const scenarioOnly = this.extractScenario(generatedFeature);
      const newContent = existingContent + '\n\n' + scenarioOnly;
      await fs.promises.writeFile(targetPath, newContent);
      console.log(`✅ Scenario appended to existing ${targetFile}`);
    } else {
      // Create new feature file
      await fs.promises.writeFile(targetPath, generatedFeature);
      console.log(`✅ Feature file created: ${targetFile}`);
    }

    return targetPath;
  }

  /**
   * Extract only step definitions (without imports and comments)
   */
  extractStepDefinitions(content) {
    const lines = content.split('\n');
    const stepDefStart = lines.findIndex(line => line.includes("Given('") || line.includes("When('") || line.includes("Then('"));
    if (stepDefStart === -1) return '';
    
    return lines.slice(stepDefStart).join('\n');
  }

  /**
   * Extract only the scenario (without Feature header)
   */
  extractScenario(content) {
    const lines = content.split('\n');
    const scenarioStart = lines.findIndex(line => line.trim().startsWith('Scenario'));
    if (scenarioStart === -1) return '';
    
    return lines.slice(scenarioStart).join('\n');
  }

  /**
   * Show recording summary
   */
  async showRecordingSummary(recordingName) {
    const reportPath = path.join(this.recordingsDir, recordingName, 'recording-report.json');
    const readmePath = path.join(this.recordingsDir, recordingName, 'README.md');

    if (fs.existsSync(reportPath)) {
      const report = JSON.parse(await fs.promises.readFile(reportPath, 'utf8'));
      console.log(`\n📊 Recording Summary: ${recordingName}`);
      console.log(`⏱️  Duration: ${Math.floor(report.duration / 1000)}s`);
      console.log(`🎬 Actions: ${report.actionCount}`);
      console.log(`🖱️  Clicks: ${report.summary.clicks}`);
      console.log(`⌨️  Inputs: ${report.summary.inputs}`);
      if (report.summary.keypresses) {
        console.log(`🔤 Key Presses: ${report.summary.keypresses}`);
      }
      console.log(`🌐 Navigations: ${report.summary.navigations}`);
      if (report.summary.actualValuesRecorded) {
        console.log(`📝 Actual Values Captured: ${report.summary.actualValuesRecorded}`);
      }
    }

    if (fs.existsSync(readmePath)) {
      const readme = await fs.promises.readFile(readmePath, 'utf8');
      const actionsSection = readme.split('## Actions Recorded')[1];
      if (actionsSection) {
        console.log('\n📋 Recorded Actions:');
        console.log(actionsSection.split('\n').slice(0, 10).join('\n'));
      }
    }
  }
}

// CLI interface
async function main() {
  const integrator = new StepIntegrator();
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('🔧 Step Definition Integrator');
    console.log('\nUsage:');
    console.log('  node utils/step-integrator.js list                    # List recordings');
    console.log('  node utils/step-integrator.js import <recording>     # Import step definitions');
    console.log('  node utils/step-integrator.js feature <recording>    # Import feature scenario');  
    console.log('  node utils/step-integrator.js summary <recording>    # Show recording summary');
    return;
  }

  const command = args[0];
  const recordingName = args[1];

  try {
    switch (command) {
      case 'list':
        const recordings = await integrator.listRecordings();
        if (recordings.length === 0) {
          console.log('No recordings found. Run `npm run record` to create one.');
        } else {
          console.log('📁 Available recordings:');
          recordings.forEach(recording => console.log(`  - ${recording}`));
        }
        break;

      case 'import':
        if (!recordingName) {
          console.log('❌ Please specify recording name');
          break;
        }
        await integrator.importSteps(recordingName);
        break;

      case 'feature':
        if (!recordingName) {
          console.log('❌ Please specify recording name');
          break;
        }
        await integrator.importFeature(recordingName);
        break;

      case 'summary':
        if (!recordingName) {
          console.log('❌ Please specify recording name');
          break;
        }
        await integrator.showRecordingSummary(recordingName);
        break;

      default:
        console.log('❌ Unknown command:', command);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

module.exports = StepIntegrator;

if (require.main === module) {
  main();
}