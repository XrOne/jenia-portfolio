/**
 * Test de configuration Supabase
 * Lance ce script pour vérifier que ta configuration Supabase est correcte
 * 
 * Usage: npx tsx scripts/test-supabase.ts
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME || 'jenia-videos';

console.log('🧪 Test de configuration Supabase\n');

// Vérifier les variables d'environnement
console.log('📋 Variables d\'environnement:');
console.log(`   SUPABASE_URL: ${SUPABASE_URL ? '✅ Définie' : '❌ Manquante'}`);
console.log(`   SUPABASE_SERVICE_ROLE_KEY: ${SUPABASE_SERVICE_ROLE_KEY ? '✅ Définie' : '❌ Manquante'}`);
console.log(`   BUCKET_NAME: ${BUCKET_NAME}\n`);

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Configuration incomplète! Vérifiez votre fichier .env');
  process.exit(1);
}

// Créer le client Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function testSupabase() {
  try {
    console.log('🔍 Test 1: Connexion à Supabase...');
    // Tester la connexion en listant les buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Erreur de connexion:', bucketsError.message);
      return false;
    }
    
    console.log('✅ Connexion réussie!');
    console.log(`   Buckets trouvés: ${buckets?.length || 0}\n`);

    // Vérifier si le bucket existe
    console.log(`🔍 Test 2: Vérification du bucket "${BUCKET_NAME}"...`);
    const bucketExists = buckets?.some(b => b.name === BUCKET_NAME);
    
    if (!bucketExists) {
      console.error(`❌ Le bucket "${BUCKET_NAME}" n'existe pas!`);
      console.log(`   Buckets disponibles: ${buckets?.map(b => b.name).join(', ') || 'aucun'}`);
      console.log(`\n💡 Créez le bucket via le dashboard Supabase:`);
      console.log(`   1. Allez sur ${SUPABASE_URL.replace('/v1', '')}`);
      console.log(`   2. Storage > Create a new bucket`);
      console.log(`   3. Name: ${BUCKET_NAME}`);
      console.log(`   4. Public: ✅ Cochez cette case\n`);
      return false;
    }
    
    console.log('✅ Bucket trouvé!\n');

    // Tester les permissions du bucket
    console.log('🔍 Test 3: Test d\'upload...');
    const testFileName = `test-${Date.now()}.txt`;
    const testContent = 'Test de configuration Supabase';
    
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(testFileName, testContent, {
        contentType: 'text/plain',
        upsert: true
      });
    
    if (uploadError) {
      console.error('❌ Erreur d\'upload:', uploadError.message);
      console.log('\n💡 Vérifiez les politiques RLS:');
      console.log('   1. Storage > jenia-videos > Policies');
      console.log('   2. Créez une policy "Allow all" pour INSERT');
      return false;
    }
    
    console.log('✅ Upload réussi!\n');

    // Récupérer l'URL publique
    console.log('🔍 Test 4: Récupération de l\'URL publique...');
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(testFileName);
    
    console.log('✅ URL publique générée:');
    console.log(`   ${publicUrlData.publicUrl}\n`);

    // Nettoyer le fichier de test
    console.log('🔍 Test 5: Suppression du fichier test...');
    const { error: deleteError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([testFileName]);
    
    if (deleteError) {
      console.warn('⚠️  Impossible de supprimer le fichier test:', deleteError.message);
    } else {
      console.log('✅ Fichier test supprimé!\n');
    }

    console.log('🎉 Tous les tests sont passés avec succès!');
    console.log('✅ Votre configuration Supabase est correcte.\n');
    console.log('📝 Prochaines étapes:');
    console.log('   1. Lancez le serveur: pnpm dev');
    console.log('   2. Accédez à l\'admin: http://localhost:5000/admin');
    console.log('   3. Uploadez vos premières vidéos!\n');
    
    return true;
  } catch (error) {
    console.error('❌ Erreur inattendue:', error);
    return false;
  }
}

// Lancer les tests
testSupabase().then(success => {
  process.exit(success ? 0 : 1);
});
