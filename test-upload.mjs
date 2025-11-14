import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpload() {
  try {
    // Create a small test file (1MB)
    const testData = Buffer.alloc(1024 * 1024, 'test'); // 1MB of test data
    const testKey = `videos/test-${Date.now()}.bin`;
    
    console.log('Testing upload with 1MB file...');
    
    const { data, error } = await supabase.storage
      .from('videos')
      .upload(testKey, testData, {
        contentType: 'application/octet-stream',
        upsert: true,
      });
    
    if (error) {
      console.error('❌ Upload failed:', error);
      return;
    }
    
    console.log('✓ Upload successful!');
    console.log('  Path:', data.path);
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('videos')
      .getPublicUrl(testKey);
    
    console.log('  Public URL:', publicUrl);
    
    // Clean up test file
    console.log('\nCleaning up test file...');
    const { error: deleteError } = await supabase.storage
      .from('videos')
      .remove([testKey]);
    
    if (deleteError) {
      console.error('Failed to delete test file:', deleteError);
    } else {
      console.log('✓ Test file deleted');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testUpload();
