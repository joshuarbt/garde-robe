import type { Metadata } from "next";
import Link from "next/link";
import { LegalArticle, LegalSection } from "@/components/legal/LegalArticle";
import { PageShell } from "@/components/layout/PageShell";
import { legalConfig } from "@/lib/legal/config";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Garde-robe",
  description: "Politique de confidentialité et protection des données personnelles (RGPD).",
};

export default function ConfidentialitePage() {
  return (
    <PageShell
      title="Politique de confidentialité"
      subtitle={`Dernière mise à jour : ${legalConfig.lastUpdated}`}
      wide
    >
      <LegalArticle>
        <LegalSection title="1. Responsable du traitement">
          <p>
            Le responsable du traitement des données personnelles est{" "}
            <strong>{legalConfig.controllerName}</strong>.
          </p>
          <p>
            Pour toute question relative à vos données personnelles :{" "}
            <a
              href={`mailto:${legalConfig.contactEmail}`}
              className="text-[var(--foreground)] underline-offset-2 hover:underline"
            >
              {legalConfig.contactEmail}
            </a>
          </p>
        </LegalSection>

        <LegalSection title="2. Données collectées">
          <p>Nous collectons les données suivantes lorsque vous utilisez Garde-robe :</p>
          <ul className="list-disc space-y-2 pl-5 text-[var(--muted)]">
            <li>
              <strong className="text-[var(--foreground)]">Compte</strong> — adresse e-mail et
              mot de passe (stockés de manière sécurisée par Supabase Auth)
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Profil</strong> — préférence de
              devise (code ISO)
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Garde-robe</strong> — noms, catégories,
              marques, couleurs, saisons, étiquettes, notes, prix optionnels et photos de vos
              articles
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Tenues</strong> — noms, notes et
              compositions (placements sur le canevas)
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Calendrier</strong> — dates auxquelles
              vous planifiez une tenue
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Technique</strong> — cookies de session
              (voir section Cookies)
            </li>
          </ul>
          <p className="text-[var(--muted)]">
            Nous ne collectons pas de données de géolocalisation, de publicité ni de suivi
            comportemental.
          </p>
        </LegalSection>

        <LegalSection title="3. Finalités et bases légales">
          <ul className="list-disc space-y-2 pl-5 text-[var(--muted)]">
            <li>
              <strong className="text-[var(--foreground)]">Exécution du contrat</strong> (art. 6
              §1 b RGPD) — création de compte, gestion de votre garde-robe, tenues et calendrier
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Cookies essentiels</strong> — maintien
              de votre session connectée (nécessaires au service)
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Consentement</strong> (art. 6 §1 a) —
              réservé à d&apos;éventuels outils d&apos;analyse ou de marketing que nous
              n&apos;utilisons pas actuellement
            </li>
          </ul>
        </LegalSection>

        <LegalSection title="4. Destinataires et sous-traitants">
          <p>Vos données sont hébergées et traitées par les prestataires suivants :</p>
          <ul className="list-disc space-y-2 pl-5 text-[var(--muted)]">
            <li>
              <strong className="text-[var(--foreground)]">Supabase Inc.</strong> — authentification,
              base de données PostgreSQL et stockage des images ({legalConfig.supabaseRegion})
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Vercel Inc.</strong> — hébergement de
              l&apos;application web
            </li>
          </ul>
          <p className="text-[var(--muted)]">
            Des accords de sous-traitance (DPA) conformes au RGPD doivent être signés avec ces
            prestataires. Les polices typographiques Google sont téléchargées à la compilation et
            servies depuis notre infrastructure — aucune requête runtime vers Google.
          </p>
        </LegalSection>

        <LegalSection title="5. Transferts hors Union européenne">
          <p className="text-[var(--muted)]">
            Lorsque nos sous-traitants traitent des données en dehors de l&apos;Espace économique
            européen, ils s&apos;appuient sur des garanties appropriées (clauses contractuelles
            types de la Commission européenne ou décision d&apos;adéquation). Vérifiez la région
            de votre projet Supabase dans votre tableau de bord.
          </p>
        </LegalSection>

        <LegalSection title="6. Durée de conservation">
          <ul className="list-disc space-y-2 pl-5 text-[var(--muted)]">
            <li>
              Données de compte et contenu : conservées tant que votre compte est actif
            </li>
            <li>
              Après suppression de compte : effacement sous 30 jours (sauf obligation légale
              contraire)
            </li>
            <li>Cookies de session : durée de la session ou jusqu&apos;à déconnexion</li>
          </ul>
        </LegalSection>

        <LegalSection title="7. Vos droits">
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul className="list-disc space-y-2 pl-5 text-[var(--muted)]">
            <li>
              <strong className="text-[var(--foreground)]">Accès</strong> et{" "}
              <strong className="text-[var(--foreground)]">portabilité</strong> — export de vos
              données depuis{" "}
              <Link href="/compte" className="text-[var(--foreground)] underline-offset-2 hover:underline">
                Mon compte
              </Link>
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Rectification</strong> — modification de
              vos articles et tenues dans l&apos;application ; contactez-nous pour l&apos;e-mail de
              compte
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Effacement</strong> — suppression de
              compte depuis{" "}
              <Link href="/compte" className="text-[var(--foreground)] underline-offset-2 hover:underline">
                Mon compte
              </Link>
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Opposition et limitation</strong> —
              contactez-nous par e-mail
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Réclamation</strong> — auprès de la CNIL
              ({" "}
              <a
                href="https://www.cnil.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--foreground)] underline-offset-2 hover:underline"
              >
                www.cnil.fr
              </a>
              )
            </li>
          </ul>
        </LegalSection>

        <LegalSection title="8. Sécurité">
          <p className="text-[var(--muted)]">
            Nous appliquons des mesures techniques appropriées : chiffrement HTTPS, isolation des
            données par utilisateur (Row Level Security), stockage privé des images, clés d&apos;API
            à privilèges limités côté client.
          </p>
        </LegalSection>

        <LegalSection title="9. Cookies" id="cookies">
          <p>Nous utilisons deux types de cookies :</p>
          <ul className="list-disc space-y-2 pl-5 text-[var(--muted)]">
            <li>
              <strong className="text-[var(--foreground)]">Cookies essentiels</strong> — cookies de
              session Supabase (
              <code className="text-[var(--foreground)]">sb-*-auth-token</code>) nécessaires à la
              connexion et au fonctionnement du service. Ils ne requièrent pas votre consentement
              préalable.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Cookies non essentiels</strong> — mesure
              d&apos;audience (statistiques anonymes). Ils ne sont déposés qu&apos;avec votre
              consentement explicite via le bandeau ou la page «&nbsp;Gérer les cookies&nbsp;».
              Aucun outil de mesure d&apos;audience n&apos;est actif pour l&apos;instant.
            </li>
          </ul>
          <p className="text-[var(--muted)]">
            Refuser les cookies non essentiels n&apos;affecte pas votre connexion ni l&apos;utilisation
            de la garde-robe, des tenues ou du calendrier. Vous pouvez modifier votre choix à tout
            moment depuis le pied de page ou{" "}
            <Link href="/compte" className="text-[var(--foreground)] underline-offset-2 hover:underline">
              Mon compte
            </Link>
            .
          </p>
        </LegalSection>

        <LegalSection title="10. Âge minimum">
          <p className="text-[var(--muted)]">
            Le service est destiné aux personnes âgées d&apos;au moins 16 ans. Si vous pensez qu&apos;un
            mineur nous a transmis des données sans autorisation parentale, contactez-nous pour
            demander leur suppression.
          </p>
        </LegalSection>

        <LegalSection title="11. Modifications">
          <p className="text-[var(--muted)]">
            Nous pouvons mettre à jour cette politique. La date de dernière mise à jour figure en
            tête de page. En cas de changement substantiel, nous vous en informerons par des moyens
            appropriés.
          </p>
        </LegalSection>
      </LegalArticle>
    </PageShell>
  );
}
