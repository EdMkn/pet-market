#!/usr/bin/env node

// This script would use GraphQL Code Generator
// Install: npm install -D @graphql-codegen/cli @graphql-codegen/typescript

const { execSync } = require('child_process');

console.log('🚀 Generating types from GraphQL schema...');

try {
  // This would run GraphQL Code Generator
  execSync('npx graphql-codegen --config codegen.yml', { stdio: 'inherit' });
  console.log('✅ GraphQL types generated successfully!');
} catch (error) {
  console.error('❌ Failed to generate types:', error.message);
  process.exit(1);
} 