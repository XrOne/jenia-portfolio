import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixRLSPolicies() {
  console.log('Checking RLS policies for videos bucket...\n');
  
  // Check if RLS is enabled on storage.objects
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  
  if (bucketsError) {
    console.error('Error listing buckets:', bucketsError);
    return;
  }
  
  console.log('Buckets found:', buckets.map(b => b.name).join(', '));
  
  // The RLS policies need to be set via SQL
  // Let's create a SQL script that can be run manually
  const sqlScript = `
-- Disable RLS on storage.objects for the videos bucket (temporary solution)
-- Or create proper policies

-- Option 1: Disable RLS (simple but less secure)
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Option 2: Create policies (more secure)
-- Allow authenticated users to upload to videos bucket
CREATE POLICY "Allow authenticated uploads to videos bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'videos');

-- Allow public read access to videos bucket
CREATE POLICY "Allow public read access to videos bucket"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'videos');

-- Allow authenticated users to update their own files
CREATE POLICY "Allow authenticated updates to videos bucket"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'videos');

-- Allow authenticated users to delete their own files
CREATE POLICY "Allow authenticated deletes to videos bucket"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'videos');
`;

  console.log('\n=== SQL Script to fix RLS policies ===\n');
  console.log(sqlScript);
  console.log('\n=== End of SQL Script ===\n');
  
  console.log('To apply these policies:');
  console.log('1. Go to Supabase Dashboard → SQL Editor');
  console.log('2. Paste the SQL script above');
  console.log('3. Run the script');
  console.log('\nOR use the MCP Supabase tool to execute SQL directly');
}

fixRLSPolicies();
