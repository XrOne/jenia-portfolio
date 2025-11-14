import postgres from 'postgres';

const sql = postgres('postgresql://postgres:aINVEWaCS6VTmGt4@db.dmqffcyiclqxqzfkdijy.supabase.co:5432/postgres', {
  ssl: { rejectUnauthorized: false }
});

try {
  const result = await sql`SELECT current_database(), version()`;
  console.log('✅ Connexion réussie!');
  console.log('Database:', result[0].current_database);
  console.log('Version:', result[0].version.substring(0, 50) + '...');
  
  const tables = await sql`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`;
  console.log('\n📋 Tables:', tables.map(t => t.tablename).join(', '));
  
  await sql.end();
} catch (error) {
  console.error('❌ Erreur:', error.message);
  process.exit(1);
}
