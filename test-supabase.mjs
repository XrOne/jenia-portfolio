import { createClient } from '@supabase/supabase-js';

console.log('Testing Supabase connection...\n');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('SUPABASE_URL:', supabaseUrl ? '✓ Defined' : '✗ Missing');
console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✓ Defined' : '✗ Missing');

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ Missing Supabase credentials');
  process.exit(1);
}

try {
  const supabase = createClient(supabaseUrl, supabaseKey);
  console.log('\n✅ Supabase client created');
  
  // Test database connection
  console.log('\nTesting database connection...');
  const { data, error } = await supabase
    .from('videos')
    .select('count')
    .limit(1);
  
  if (error) {
    console.error('❌ Database error:', error.message);
  } else {
    console.log('✅ Database connection successful');
  }
  
  // Test storage connection
  console.log('\nTesting storage connection...');
  const { data: buckets, error: storageError } = await supabase
    .storage
    .listBuckets();
  
  if (storageError) {
    console.error('❌ Storage error:', storageError.message);
  } else {
    console.log('✅ Storage connection successful');
    console.log('Buckets:', buckets.map(b => b.name).join(', '));
  }
  
  console.log('\n✅ All tests passed!');
} catch (error) {
  console.error('\n❌ Test failed:', error.message);
  process.exit(1);
}
