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

async function checkBucket() {
  try {
    console.log('Checking bucket configuration...\n');
    
    // List all buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      return;
    }
    
    console.log('Available buckets:');
    buckets.forEach(bucket => {
      console.log(`- ${bucket.name} (public: ${bucket.public}, file_size_limit: ${bucket.file_size_limit || 'unlimited'})`);
    });
    
    // Check if 'videos' bucket exists
    const videosBucket = buckets.find(b => b.name === 'videos');
    if (videosBucket) {
      console.log('\n✓ Videos bucket found');
      console.log('  Public:', videosBucket.public);
      console.log('  File size limit:', videosBucket.file_size_limit || 'unlimited');
      console.log('  Allowed MIME types:', videosBucket.allowed_mime_types || 'all');
    } else {
      console.log('\n✗ Videos bucket not found');
    }
    
    // List files in the bucket
    const { data: files, error: filesError } = await supabase.storage
      .from('videos')
      .list('videos', { limit: 10 });
    
    if (filesError) {
      console.error('\nError listing files:', filesError);
    } else {
      console.log(`\nFiles in bucket (showing first 10):`);
      if (files.length === 0) {
        console.log('  (no files)');
      } else {
        files.forEach(file => {
          const sizeMB = (file.metadata?.size || 0) / 1024 / 1024;
          console.log(`  - ${file.name} (${sizeMB.toFixed(2)} MB)`);
        });
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkBucket();
