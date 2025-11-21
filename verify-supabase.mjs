import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ ERREUR: Variables d\'environnement manquantes');
  console.error('   SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🔍 Vérification de la configuration Supabase...\n');

async function verifyDatabase() {
  console.log('📊 Vérification de la base de données...');
  
  try {
    // Test connection with a simple query
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      if (error.code === '42P01') {
        console.log('   ⚠️  Table "users" n\'existe pas encore');
        console.log('   ℹ️  Exécutez la migration SQL sur Supabase Dashboard');
        return false;
      }
      throw error;
    }
    
    console.log('   ✅ Connexion à la base de données réussie');
    
    // Check for all required tables
    const tables = ['users', 'videos', 'projects', 'services'];
    console.log('\n📋 Vérification des tables...');
    
    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .select('id')
        .limit(1);
      
      if (error && error.code === '42P01') {
        console.log(`   ⚠️  Table "${table}" manquante`);
      } else if (error) {
        console.log(`   ❌ Erreur pour la table "${table}":`, error.message);
      } else {
        console.log(`   ✅ Table "${table}" existe`);
      }
    }
    
    return true;
  } catch (error) {
    console.error('   ❌ Erreur de connexion:', error.message);
    return false;
  }
}

async function verifyStorage() {
  console.log('\n📦 Vérification du Storage...');
  
  try {
    // List buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('   ❌ Erreur lors de la récupération des buckets:', bucketsError.message);
      return false;
    }
    
    const videosBucket = buckets.find(b => b.name === 'videos');
    
    if (!videosBucket) {
      console.log('   ⚠️  Le bucket "videos" n\'existe pas');
      console.log('   ℹ️  Créez-le dans Supabase Dashboard → Storage');
      console.log('   ℹ️  Assurez-vous qu\'il est PUBLIC');
      return false;
    }
    
    console.log('   ✅ Bucket "videos" existe');
    console.log('   ℹ️  Public:', videosBucket.public ? 'Oui ✅' : 'Non ⚠️');
    
    // Test upload permissions
    console.log('\n🧪 Test d\'upload...');
    const testFileName = `test-${Date.now()}.txt`;
    const testContent = new TextEncoder().encode('Test upload');
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('videos')
      .upload(testFileName, testContent, {
        contentType: 'text/plain',
        upsert: true
      });
    
    if (uploadError) {
      console.error('   ❌ Erreur d\'upload:', uploadError.message);
      console.log('   ℹ️  Vérifiez les politiques RLS du bucket');
      return false;
    }
    
    console.log('   ✅ Upload test réussi');
    
    // Test public URL
    const { data: { publicUrl } } = supabase.storage
      .from('videos')
      .getPublicUrl(testFileName);
    
    console.log('   ✅ URL publique générée:', publicUrl);
    
    // Cleanup test file
    const { error: deleteError } = await supabase.storage
      .from('videos')
      .remove([testFileName]);
    
    if (!deleteError) {
      console.log('   ✅ Suppression test réussie');
    }
    
    return true;
  } catch (error) {
    console.error('   ❌ Erreur Storage:', error.message);
    return false;
  }
}

async function verifyAdminUser() {
  console.log('\n👤 Vérification des utilisateurs admin...');
  
  try {
    const { data: admins, error } = await supabase
      .from('users')
      .select('id, name, email, role')
      .eq('role', 'admin');
    
    if (error) {
      if (error.code === '42P01') {
        console.log('   ⚠️  Table "users" n\'existe pas');
        return false;
      }
      throw error;
    }
    
    if (!admins || admins.length === 0) {
      console.log('   ⚠️  Aucun utilisateur admin trouvé');
      console.log('   ℹ️  Créez un admin avec cette commande SQL:');
      console.log('   INSERT INTO users (openId, name, email, role)');
      console.log('   VALUES (\'admin-001\', \'Admin\', \'admin@example.com\', \'admin\');');
      return false;
    }
    
    console.log(`   ✅ ${admins.length} utilisateur(s) admin trouvé(s):`);
    admins.forEach(admin => {
      console.log(`      - ${admin.name || 'Sans nom'} (${admin.email || 'Sans email'})`);
    });
    
    return true;
  } catch (error) {
    console.error('   ❌ Erreur:', error.message);
    return false;
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('🔧 VÉRIFICATION SUPABASE - JENIA PORTFOLIO');
  console.log('='.repeat(60));
  console.log();
  
  const dbOk = await verifyDatabase();
  const storageOk = await verifyStorage();
  const adminOk = await verifyAdminUser();
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 RÉSUMÉ');
  console.log('='.repeat(60));
  console.log('Base de données:', dbOk ? '✅' : '⚠️');
  console.log('Storage:', storageOk ? '✅' : '⚠️');
  console.log('Utilisateur admin:', adminOk ? '✅' : '⚠️');
  console.log('='.repeat(60));
  
  if (dbOk && storageOk && adminOk) {
    console.log('\n✅ Tout est configuré correctement! Prêt pour le déploiement.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Certaines configurations nécessitent attention.');
    console.log('ℹ️  Consultez les messages ci-dessus pour plus de détails.');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('\n❌ Erreur fatale:', error);
  process.exit(1);
});
