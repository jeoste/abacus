# 🚀 Démarrage Rapide

## En 3 étapes

### 1️⃣ Configuration Supabase (5 minutes)

1. Créez un compte sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Dans "SQL Editor", exécutez le contenu de `supabase-schema.sql`
4. Dans "Settings" > "API", copiez :
   - Project URL
   - anon public key
   - service_role key

### 2️⃣ Configuration locale (2 minutes)

Créez `abacus-web/.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role
```

### 3️⃣ Lancement (1 minute)

```bash
cd abacus-web
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) 🎉

---

## ✅ Version Node.js

L'application utilise **Next.js 14** qui est compatible avec **Node.js 18.17.0+**.

Vous avez **Node.js 18.20.8** - c'est parfait ! ✅

L'application devrait fonctionner sans problème.

**Vérifier votre configuration :**
```bash
npm run check-env
```

---

## 📖 Documentation complète

Pour plus de détails, consultez [SETUP_LOCAL.md](./SETUP_LOCAL.md)

