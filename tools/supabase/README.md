# Supabase Database Management Tools

This directory contains tools for managing the Supabase database structures for the Módulo de Matrículas application.

## Overview

These scripts provide programmatic access to create and verify database structures in Supabase, including:

- Storage buckets
- Schemas
- Tables
- Functions
- Triggers
- RLS policies

## Available Scripts

### Storage Buckets
- `create-buckets.js` - Creates and configures storage buckets for documents, contracts, and profile pictures

### Schema and Tables
- `create-matricula-schema.js` - Creates the matricula schema
- `create-matricula-tables.js` - Creates tables in the matricula schema
- `create-admin-users.js` - Creates the admin_users table with RLS policies
- `create-matricula-documentos.js` - Creates the matricula_documentos table
- `create-matricula-contratos.js` - Creates the matricula_contratos table
- `create-email-tables.js` - Creates email-related tables

### Verification
- `verify-database-structures.js` - Verifies that all required database structures exist

## Usage

1. Install dependencies:
```
npm install
```

2. Run the scripts in the following order:
```
node create-buckets.js
node create-matricula-schema.js
node create-admin-users.js
node create-matricula-documentos.js
node create-matricula-contratos.js
node create-email-tables.js
node create-matricula-tables.js
node verify-database-structures.js
```

## Environment Variables

The scripts use the following Supabase credentials:
- Supabase URL: `https://uasnyifizdjxogowijip.supabase.co`
- Service Role Key: Stored in the scripts (for development only)

## Security Note

In a production environment, the service role key should be stored in environment variables and not hardcoded in the scripts.
