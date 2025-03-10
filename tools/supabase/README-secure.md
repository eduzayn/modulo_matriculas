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

## Security Note

These tools require Supabase service role credentials which have full access to your database. To use these tools securely:

1. Copy `.env.example` to `.env` and fill in your credentials
2. Never commit the `.env` file to version control
3. Use environment variables in production environments

## Setup

1. Install dependencies:
```
npm install
```

2. Create a `.env` file with your Supabase credentials:
```
cp .env.example .env
```

3. Edit the `.env` file with your actual credentials

## Available Scripts

### Storage Buckets
- `secure-create-buckets.js` - Creates and configures storage buckets for documents, contracts, and profile pictures

### Verification
- `secure-verify-database.js` - Verifies that all required database structures exist

## Usage

1. Create storage buckets:
```
node secure-create-buckets.js
```

2. Verify database structures:
```
node secure-verify-database.js
```

## Database Structures

The following database structures are required for the Módulo de Matrículas application:

### Storage Buckets
- `matricula_documentos` - For storing student documents
- `contratos` - For storing contracts
- `perfil` - For storing profile pictures

### Schemas
- `matricula` - Main schema for matriculation data

### Public Tables
- `admin_users` - Administrative users with role-based access
- `matricula_documentos` - Public table for matriculation documents
- `matricula_contratos` - Contracts related to matriculations
- `email_templates` - Email templates for notifications
- `email_logs` - Logs of sent emails

### Matricula Schema Tables
- `matricula.registros` - Main matriculation records
- `matricula.documentos` - Documents related to matriculations

### Custom Types
- `matricula_status` - Enum for matriculation status
- `documento_status` - Enum for document status
- `assinatura_status` - Enum for signature status
