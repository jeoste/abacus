# Désactiver la vérification d'email

## Pourquoi désactiver la vérification d'email ?

Par défaut, Supabase peut exiger que les utilisateurs vérifient leur email avant de pouvoir se connecter. Si vous souhaitez permettre aux utilisateurs de se connecter immédiatement après l'inscription (sans vérification d'email), vous devez désactiver cette fonctionnalité dans Supabase.

## Étapes pour désactiver la vérification d'email

1. **Connectez-vous à votre projet Supabase**
   - Allez sur [https://supabase.com](https://supabase.com)
   - Sélectionnez votre projet

2. **Accédez aux paramètres d'authentification**
   - Cliquez sur **Settings** (icône d'engrenage en bas à gauche)
   - Cliquez sur **Authentication** dans le menu de gauche
   - Cliquez sur **Email Auth** dans le sous-menu

3. **Désactivez la confirmation d'email**
   - Trouvez la section **Email Auth**
   - Décochez la case **Enable email confirmations**
   - ⚠️ **Important** : Cliquez sur **Save** pour enregistrer les modifications

4. **Vérification**
   - Après avoir désactivé cette option, les utilisateurs pourront :
     - Créer un compte
     - Se connecter immédiatement sans vérifier leur email
   - Les emails de confirmation ne seront plus envoyés

## ⚠️ Important pour la production

- **En développement** : La désactivation de la vérification d'email est pratique pour tester rapidement
- **En production** : Il est recommandé d'activer la vérification d'email pour :
  - Sécuriser les comptes
  - Vérifier que les emails sont valides
  - Réduire les comptes frauduleux

Si vous activez la vérification d'email en production, assurez-vous d'avoir configuré un service SMTP (voir `CONFIGURATION_SUPABASE.md`).

## Réactiver la vérification d'email

Si vous souhaitez réactiver la vérification d'email :

1. Allez dans **Settings** > **Authentication** > **Email Auth**
2. Cochez **Enable email confirmations**
3. Configurez un SMTP personnalisé (voir `CONFIGURATION_SUPABASE.md` - Étape 6.1)
4. Cliquez sur **Save**

## Test

Pour tester que la désactivation fonctionne :

1. Créez un nouveau compte via `/signup`
2. Essayez de vous connecter immédiatement via `/login`
3. Vous devriez pouvoir vous connecter sans avoir vérifié votre email

