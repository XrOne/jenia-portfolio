import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function createAdminUser() {
  const email = 'bch.film@gmail.com';
  const password = 'Admin123!Jenia';

  console.log('Creating admin user...');

  // Create user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Auto-confirm email
  });

  if (authError) {
    console.error('Error creating auth user:', authError);
    return;
  }

  console.log('✅ Auth user created:', authData.user.id);

  // Update user role in database
  const { error: dbError } = await supabase
    .from('users')
    .upsert({
      openId: email,
      email: email,
      name: 'Admin',
      role: 'admin',
      loginMethod: 'email',
    }, {
      onConflict: 'openId'
    });

  if (dbError) {
    console.error('Error updating user role:', dbError);
    return;
  }

  console.log('✅ User role updated to admin');
  console.log('\nVous pouvez maintenant vous connecter avec :');
  console.log('Email:', email);
  console.log('Password:', password);
}

createAdminUser().catch(console.error);
