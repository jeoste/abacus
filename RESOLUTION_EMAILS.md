# Résolution : Emails de confirmation non reçus

## Problème
Lors de la création d'un compte, vous voyez un message indiquant qu'un email de confirmation a été envoyé, mais vous ne recevez aucun email.

## Solution rapide

### Étape 1 : Vérifier la configuration SMTP dans Supabase

1. Connectez-vous à votre projet Supabase
2. Allez dans **Settings** (icône d'engrenage) > **Authentication**
3. Cliquez sur **SMTP Settings** dans le menu de gauche
4. Vérifiez si **Enable Custom SMTP** est activé

### Étape 2 : Configurer un SMTP (si non configuré)

Si **Enable Custom SMTP** n'est pas activé, c'est probablement la cause du problème.

#### Option A : Utiliser Gmail (pour le développement)

1. **Activer Custom SMTP**
   - Cochez **Enable Custom SMTP**

2. **Remplir les informations**
   - **Sender email** : `votre-email@gmail.com`
   - **Sender name** : `Abacus`
   - **Host** : `smtp.gmail.com`
   - **Port** : `587`
   - **Username** : `votre-email@gmail.com` (votre adresse Gmail complète)
   - **Password** : ⚠️ **IMPORTANT** : Utilisez un "Mot de passe d'application" Gmail

3. **Créer un mot de passe d'application Gmail**
   - Allez sur [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Si vous ne voyez pas cette page, activez la validation en 2 étapes d'abord
   - Sélectionnez :
     - **App** : Mail
     - **Device** : Autre (nom personnalisé) → Entrez "Supabase"
   - Cliquez sur **Générer**
   - Copiez le mot de passe de 16 caractères (sans espaces)
   - Collez-le dans le champ **Password** de Supabase

4. **Sauvegarder**
   - Cliquez sur **Save**
   - Cliquez sur **Send test email** pour tester

#### Option B : Désactiver temporairement la confirmation (DÉVELOPPEMENT UNIQUEMENT)

⚠️ **ATTENTION** : Ne faites cela QUE pour tester localement, jamais en production !

1. Allez dans **Settings** > **Authentication** > **Email Auth**
2. Décochez **Enable email confirmations**
3. Les utilisateurs pourront maintenant se connecter sans valider leur email
4. ⚠️ **N'oubliez pas de réactiver cette option avant la production !**

### Étape 3 : Vérifier les autres paramètres

1. **Vérifier la confirmation d'email est activée**
   - **Settings** > **Authentication** > **Email Auth**
   - ✅ **Enable email confirmations** doit être coché

2. **Vérifier les URLs de redirection**
   - **Settings** > **Authentication** > **URL Configuration**
   - **Site URL** : `http://localhost:3000` (développement)
   - **Redirect URLs** : Doit contenir `http://localhost:3000/auth/callback`

### Étape 4 : Tester

1. Essayez de créer un nouveau compte
2. Vérifiez votre boîte de réception
3. Vérifiez aussi votre dossier spam/courrier indésirable

## Solutions alternatives pour la production

Pour la production, utilisez un service d'email professionnel :

- **SendGrid** : [https://sendgrid.com](https://sendgrid.com) (plan gratuit disponible)
- **Mailgun** : [https://www.mailgun.com](https://www.mailgun.com) (plan gratuit disponible)
- **AWS SES** : [https://aws.amazon.com/ses](https://aws.amazon.com/ses) (payant mais très fiable)

Voir la section **Étape 6.1 - Option A** dans `CONFIGURATION_SUPABASE.md` pour les détails de configuration.

## Vérification

Pour vérifier que tout fonctionne :

1. Allez dans **Settings** > **Authentication** > **SMTP Settings**
2. Cliquez sur **Send test email**
3. Entrez votre adresse email
4. Vérifiez que vous recevez l'email de test

Si l'email de test fonctionne, les emails de confirmation devraient aussi fonctionner.

