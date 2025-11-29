// Script de vérification de l'environnement
const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification de l\'environnement...\n');

// Vérifier Node.js
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));
const minorVersion = parseInt(nodeVersion.split('.')[1]);

console.log(`Node.js version: ${nodeVersion}`);

if (majorVersion < 18 || (majorVersion === 18 && minorVersion < 17)) {
  console.log('⚠️  ATTENTION: Node.js 18.17.0+ est requis pour Next.js 14');
  console.log('   Vous pouvez continuer mais des erreurs peuvent survenir.\n');
} else {
  console.log('✅ Version de Node.js compatible (Next.js 14 supporte Node.js 18+)\n');
}

// Vérifier .env.local
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  console.log('✅ Fichier .env.local trouvé');
  
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const hasSupabaseUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL') && 
                         !envContent.includes('votre-projet');
  const hasAnonKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY') && 
                    !envContent.includes('votre_cle_anon_ici');
  const hasServiceKey = envContent.includes('SUPABASE_SERVICE_ROLE_KEY') && 
                       !envContent.includes('votre_cle_service_role_ici');
  
  if (hasSupabaseUrl && hasAnonKey && hasServiceKey) {
    console.log('✅ Variables d\'environnement configurées\n');
  } else {
    console.log('⚠️  Variables d\'environnement à configurer dans .env.local\n');
  }
} else {
  console.log('❌ Fichier .env.local non trouvé');
  console.log('   Créez-le avec les variables Supabase (voir SETUP_LOCAL.md)\n');
}

// Vérifier node_modules
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('✅ Dépendances installées\n');
} else {
  console.log('❌ Dépendances non installées');
  console.log('   Exécutez: npm install\n');
}

console.log('📚 Pour plus d\'informations, consultez SETUP_LOCAL.md');

