#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const schemaPath = path.join(__dirname, '../apps/vn-record-store-be/prisma/schema.prisma');

console.log('👀 Watching Prisma schema for changes...');
console.log(`📁 Watching: ${schemaPath}`);

// Generate types initially
try {
  execSync('npm run generate:types', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Initial type generation failed:', error.message);
}

// Watch for changes
fs.watchFile(schemaPath, (curr, prev) => {
  console.log('\n🔄 Prisma schema changed, regenerating types...');
  
  try {
    execSync('npm run generate:types', { stdio: 'inherit' });
    console.log('✅ Types updated successfully!\n');
  } catch (error) {
    console.error('❌ Type generation failed:', error.message);
  }
});

console.log('✨ Type watcher started. Press Ctrl+C to stop.\n'); 