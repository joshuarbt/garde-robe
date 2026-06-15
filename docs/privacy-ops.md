# Conformité RGPD — opérations

Checklist organisationnelle avant mise en production auprès d'utilisateurs de l'UE. Ces étapes ne sont pas automatisées dans le code.

## Avant le lancement

- [ ] Renseigner les variables `LEGAL_CONTROLLER_NAME`, `LEGAL_CONTACT_EMAIL` et `LEGAL_SUPABASE_REGION` dans Vercel (Production)
- [ ] Configurer `SUPABASE_SERVICE_ROLE_KEY` dans Vercel (Production uniquement, jamais en `NEXT_PUBLIC_*`)
- [ ] Signer le DPA Supabase : [Supabase Dashboard](https://supabase.com/dashboard) → Organization → Legal / DPA
- [ ] Signer le DPA Vercel : [Vercel Account Settings](https://vercel.com/account) → Legal
- [ ] Vérifier la **région** du projet Supabase (idéalement UE) et mettre à jour `LEGAL_SUPABASE_REGION`
- [ ] Activer la **confirmation e-mail** en production : Supabase → Authentication → Providers → Email → Confirm email (voir [auth.md](./auth.md))
- [ ] Ajouter l'URL de production dans Supabase → Authentication → URL Configuration (Site URL + Redirect URLs)

## Après le lancement

- [ ] Tester l'export de données depuis `/compte` sur un compte de test
- [ ] Tester la suppression de compte sur un projet Supabase de staging (vérifiez : plus de lignes DB, plus de fichiers Storage, connexion impossible)
- [ ] Conserver une copie du [registre des traitements](./privacy-register.md)

## Contact des demandes RGPD

Les utilisateurs peuvent :

- Exporter leurs données : `/compte`
- Supprimer leur compte : `/compte`
- Vous contacter : e-mail défini dans `LEGAL_CONTACT_EMAIL`

Répondez aux demandes d'accès ou de rectification dans un délai d'un mois (art. 12 RGPD).

## Analytics et cookies

Le bandeau de consentement (`CookieConsentBanner`) enregistre le choix dans `localStorage` (`garde-robe-cookie-consent`). Les cookies essentiels (session Supabase) ne sont jamais bloqués.

Avant d'activer Vercel Analytics, PostHog ou tout script non essentiel :

1. Mettre à jour `/confidentialite` (section Cookies)
2. Brancher le SDK **uniquement** dans [`src/components/cookies/NonEssentialScripts.tsx`](../src/components/cookies/NonEssentialScripts.tsx) — jamais dans `layout.tsx` ou une page directement
3. Vérifier que le script ne se charge pas tant que `consent.analytics !== true`

Les utilisateurs peuvent modifier leur choix via « Gérer les cookies » (pied de page) ou `/compte`.
