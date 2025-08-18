#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read Prisma schema
const schemaPath = path.join(__dirname, '../apps/vn-record-store-be/prisma/schema.prisma');

if (!fs.existsSync(schemaPath)) {
  console.error('❌ Prisma schema not found at:', schemaPath);
  process.exit(1);
}

const schema = fs.readFileSync(schemaPath, 'utf8');

// Extract models and enums from schema
function extractModelsAndEnums(schema) {
  const models = {};
  const enums = {};
  
  // Extract models
  const modelRegex = /model\s+(\w+)\s*{([^}]*)}/g;
  let match;

  while ((match = modelRegex.exec(schema)) !== null) {
    const modelName = match[1];
    const fields = match[2];
    
    // First pass to get enums, second pass will use them
    models[modelName] = { fieldsString: fields };
  }
  
  // Extract enums
  const enumRegex = /enum\s+(\w+)\s*{([^}]*)}/g;
  while ((match = enumRegex.exec(schema)) !== null) {
    const enumName = match[1];
    const values = match[2];
    
    enums[enumName] = parseEnumValues(values);
  }
  
  // Second pass: parse model fields with enum knowledge
  for (const [modelName, modelData] of Object.entries(models)) {
    models[modelName] = parseFields(modelData.fieldsString, enums);
  }
  
  return { models, enums };
}

function parseEnumValues(valuesString) {
  const values = [];
  const lines = valuesString.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('//')) {
      values.push(trimmed);
    }
  }
  
  return values;
}

function parseFields(fieldsString, enums = {}) {
  const fields = [];
  const lines = fieldsString.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip comments, empty lines, and block attributes
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('@@')) {
      continue;
    }
    
    // Improved regex to handle more cases: fieldName Type[] ? @attributes
    const fieldMatch = trimmed.match(/^(\w+)\s+(\w+)(\[\])?\s*\??/);
    if (fieldMatch) {
      const [, name, type, isArray] = fieldMatch;
      
      // Skip relation fields (they usually have @relation or reference other models)
      if (trimmed.includes('@relation') || isRelationType(type, enums)) {
        continue;
      }
      
      fields.push({
        name,
        type: mapPrismaTypeToTS(type),
        isArray: !!isArray,
        isOptional: trimmed.includes('?')
      });
    }
  }
  
  return fields;
}

function isRelationType(type, enums) {
  // Common relation types (not primitive types or enums)
  const primitiveTypes = ['String', 'Int', 'Float', 'Boolean', 'DateTime', 'Json', 'BigInt', 'Decimal', 'Bytes'];
  const enumNames = Object.keys(enums);
  
  return !primitiveTypes.includes(type) && !enumNames.includes(type);
}

function mapPrismaTypeToTS(prismaType) {
  const typeMap = {
    'String': 'string',
    'Int': 'number',
    'Float': 'number',
    'Boolean': 'boolean',
    'DateTime': 'Date',
    'Json': 'any',
    'BigInt': 'bigint',
    'Decimal': 'number',
    'Bytes': 'Buffer'
  };
  
  return typeMap[prismaType] || prismaType; // For enums or unknown types, keep the type name
}

function generateTypeScript(models, enums) {
  let output = '// Auto-generated from Prisma schema - DO NOT EDIT MANUALLY\n';
  output += '// Run: npm run generate:types to regenerate\n\n';
  
  // Generate enums first
  for (const [enumName, values] of Object.entries(enums)) {
    output += `export enum ${enumName} {\n`;
    for (const value of values) {
      output += `  ${value} = '${value}',\n`;
    }
    output += '}\n\n';
  }
  
  // Generate interfaces
  for (const [modelName, fields] of Object.entries(models)) {
    output += `export interface ${modelName} {\n`;
    
    for (const field of fields) {
      const optional = field.isOptional ? '?' : '';
      const array = field.isArray ? '[]' : '';
      output += `  ${field.name}${optional}: ${field.type}${array};\n`;
    }
    
    output += '}\n\n';
  }
  
  // Add custom frontend types
  output += '// Custom frontend types\n';
  output += 'export interface CartItem extends Album {\n';
  output += '  quantity: number;\n';
  output += '}\n';
  
  return output;
}

try {
  // Generate types
  console.log('🔍 Parsing Prisma schema...');
  const { models, enums } = extractModelsAndEnums(schema);
  
  if (Object.keys(models).length === 0) {
    console.warn('⚠️  No models found in Prisma schema');
    process.exit(1);
  }
  
  console.log(`📋 Found ${Object.keys(models).length} models:`, Object.keys(models).join(', '));
  console.log(`🏷️  Found ${Object.keys(enums).length} enums:`, Object.keys(enums).join(', '));
  
  const typescript = generateTypeScript(models, enums);

  // Ensure output directory exists
  const outputPath = path.join(__dirname, '../apps/vn-record-store-web/src/app/types/album.types.ts');
  const outputDir = path.dirname(outputPath);
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write to frontend types file
  fs.writeFileSync(outputPath, typescript);

  console.log('✅ Frontend types generated successfully!');
  console.log(`📁 Written to: ${outputPath}`);
  
} catch (error) {
  console.error('❌ Error generating types:', error.message);
  process.exit(1);
} 