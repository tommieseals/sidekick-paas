#!/usr/bin/env node

/**
 * Build Teams App Manifest
 * Replaces placeholders and creates zip package
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const MANIFEST_DIR = path.join(__dirname, '..', 'manifest');
const DIST_DIR = path.join(__dirname, '..', 'dist');

console.log('🏗️  Building Teams App Manifest...\n');

// Check for required environment variables
const appId = process.env.MICROSOFT_APP_ID;
if (!appId) {
  console.error('❌ Error: MICROSOFT_APP_ID not set in .env');
  console.error('   Please configure your Azure Bot first.\n');
  process.exit(1);
}

// Create dist directory
if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

// Read and process manifest
console.log('📄 Processing manifest.json...');
let manifest = fs.readFileSync(path.join(MANIFEST_DIR, 'manifest.json'), 'utf8');

// Replace placeholders
manifest = manifest.replace(/\{\{MICROSOFT_APP_ID\}\}/g, appId);

// Add ngrok domain if provided
if (process.env.NGROK_DOMAIN) {
  const manifestObj = JSON.parse(manifest);
  manifestObj.validDomains = [process.env.NGROK_DOMAIN];
  manifest = JSON.stringify(manifestObj, null, 2);
}

// Write processed manifest
fs.writeFileSync(path.join(DIST_DIR, 'manifest.json'), manifest);
console.log('   ✅ manifest.json processed');

// Copy icons (create placeholders if they don't exist)
console.log('🎨 Processing icons...');

const colorIconPath = path.join(MANIFEST_DIR, 'color.png');
const outlineIconPath = path.join(MANIFEST_DIR, 'outline.png');

// Check if icons exist, if not create simple SVG-based ones
if (!fs.existsSync(colorIconPath)) {
  console.log('   ⚠️  color.png not found, creating placeholder...');
  // Create a simple 192x192 colored icon using ImageMagick if available
  try {
    execSync(`convert -size 192x192 xc:'#0078D4' -fill white -gravity center -pointsize 100 -annotate 0 '🌍' "${colorIconPath}" 2>/dev/null || echo "Using fallback"`);
  } catch (e) {
    // Create a simple colored PNG manually (1x1 pixel PNG, scaled)
    const simplePng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChQGA60e6kgAAAABJRU5ErkJggg==', 'base64');
    fs.writeFileSync(colorIconPath, simplePng);
  }
}

if (!fs.existsSync(outlineIconPath)) {
  console.log('   ⚠️  outline.png not found, creating placeholder...');
  try {
    execSync(`convert -size 32x32 xc:none -stroke white -strokewidth 2 -fill none -draw "circle 16,16 16,2" "${outlineIconPath}" 2>/dev/null || echo "Using fallback"`);
  } catch (e) {
    // Create a simple transparent PNG
    const simplePng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
    fs.writeFileSync(outlineIconPath, simplePng);
  }
}

// Copy icons to dist
fs.copyFileSync(colorIconPath, path.join(DIST_DIR, 'color.png'));
fs.copyFileSync(outlineIconPath, path.join(DIST_DIR, 'outline.png'));
console.log('   ✅ Icons copied');

// Create zip package
console.log('📦 Creating app package...');
const zipPath = path.join(DIST_DIR, 'teams-un-translator.zip');

// Use native zip command
try {
  execSync(`cd "${DIST_DIR}" && zip -r teams-un-translator.zip manifest.json color.png outline.png`, { stdio: 'pipe' });
  console.log(`   ✅ Created: ${zipPath}\n`);
} catch (e) {
  console.error('   ❌ Failed to create zip. Please install zip command or create manually.');
  console.error(`   Files are in: ${DIST_DIR}\n`);
}

console.log('✅ Build complete!\n');
console.log('Next steps:');
console.log('1. Upload the app to Teams:');
console.log(`   ${zipPath}`);
console.log('2. Or manually create a zip with:');
console.log('   manifest.json, color.png, outline.png');
console.log('');
