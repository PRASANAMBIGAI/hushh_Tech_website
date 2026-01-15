/**
 * Run a specific migration SQL against Supabase
 * Usage: node scripts/run-migration.cjs
 */

const fs = require('fs');
const https = require('https');

const SUPABASE_URL = 'ibsisfnjxeowvdtvgzff.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlic2lzZm5qeGVvd3ZkdHZnemZmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDU1OTU3OCwiZXhwIjoyMDgwMTM1NTc4fQ.j6SSw41LwGzXGAW0U_mQh6hGGnFekOE7GV__xevJY2M';

// Read the migration SQL
const sql = fs.readFileSync('./supabase/migrations/20260116000000_create_hushh_agent_users.sql', 'utf8');

console.log('📦 Reading migration SQL...');
console.log('📡 Connecting to Supabase...');

// Use the Supabase Management API to execute SQL
const postData = JSON.stringify({ query: sql });

const options = {
  hostname: SUPABASE_URL,
  port: 443,
  path: '/rest/v1/rpc/exec_sql',
  method: 'POST',
  headers: {
    'apikey': SERVICE_KEY,
    'Authorization': `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

// Since RPC won't work, let's create the tables directly via PostgREST
// We need to use the supabase-js library instead

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  `https://${SUPABASE_URL}`,
  SERVICE_KEY
);

async function runMigration() {
  console.log('🚀 Running migration for hushh_agent_users...');
  
  // Check if table already exists
  const { data: existingTable, error: checkError } = await supabase
    .from('hushh_agent_users')
    .select('id')
    .limit(1);
  
  if (!checkError) {
    console.log('✅ Table hushh_agent_users already exists!');
    return;
  }
  
  if (checkError && !checkError.message.includes('does not exist')) {
    console.log('Table check result:', checkError.message);
  }
  
  console.log('❌ Table does not exist. Please run the SQL manually in Supabase Dashboard.');
  console.log('\n📋 Go to: https://supabase.com/dashboard/project/ibsisfnjxeowvdtvgzff/sql');
  console.log('\n📝 Copy and paste this SQL:\n');
  console.log('='.repeat(80));
  console.log(sql);
  console.log('='.repeat(80));
}

runMigration();
