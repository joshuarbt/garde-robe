# Registre des activités de traitement (Art. 30 RGPD)

Document interne simplifié pour Garde-robe. Compléter avec vos informations réelles avant production.

| Champ | Valeur |
|-------|--------|
| Responsable | `LEGAL_CONTROLLER_NAME` (voir `.env.example`) |
| Contact | `LEGAL_CONTACT_EMAIL` |
| Finalité principale | Service de gestion de garde-robe personnelle (compte, articles, tenues, calendrier) |
| Base légale | Exécution du contrat (art. 6 §1 b RGPD) |
| Catégories de personnes | Utilisateurs inscrits |
| Catégories de données | E-mail, mot de passe (hash), métadonnées garde-robe, photos, notes, prix optionnels, dates calendrier |
| Destinataires | Supabase Inc. (auth, DB, storage), Vercel Inc. (hébergement) |
| Transferts hors UE | Selon région Supabase — documenter dans la politique de confidentialité |
| Durée de conservation | Tant que le compte est actif ; suppression sous 30 jours après demande d'effacement |
| Mesures de sécurité | HTTPS, RLS Postgres, bucket Storage privé, clé anon côté client uniquement |
| Droits des personnes | Accès, portabilité (export `/compte`), rectification (édition in-app + contact), effacement (suppression compte), opposition/limitation (contact), réclamation CNIL |

## Sous-traitants

| Prestataire | Rôle | DPA |
|-------------|------|-----|
| Supabase | Auth, PostgreSQL, Storage | À signer dans le dashboard |
| Vercel | Hébergement Next.js | À signer dans le dashboard |

## Cookies

| Cookie | Finalité | Durée | Consentement |
|--------|----------|-------|--------------|
| `sb-*-auth-token` (Supabase) | Session authentifiée | Session / refresh | Non requis (strictement nécessaire) |
| Mesure d'audience (futur) | Statistiques anonymes | Selon outil | Opt-in via bandeau / préférences |

Choix utilisateur stocké dans `localStorage` (`garde-robe-cookie-consent`), modifiable via pied de page ou `/compte`.

## Incidents de sécurité

En cas de violation de données personnelles :

1. Documenter l'incident (nature, données concernées, personnes affectées)
2. Notifier la CNIL sous 72 h si risque pour les droits et libertés (art. 33)
3. Informer les utilisateurs si risque élevé (art. 34)
4. Consigner les mesures correctives

Voir [privacy-ops.md](./privacy-ops.md) pour la checklist de lancement.
