import type { Metadata } from "next";
import Link from "next/link";
import { LegalArticle, LegalSection } from "@/components/legal/LegalArticle";
import { PageShell } from "@/components/layout/PageShell";
import { legalConfig } from "@/lib/legal/config";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation — Garde-robe",
  description: "Conditions générales d'utilisation du service Garde-robe.",
};

export default function CguPage() {
  return (
    <PageShell
      title="Conditions générales d'utilisation"
      subtitle={`Dernière mise à jour : ${legalConfig.lastUpdated}`}
      wide
    >
      <LegalArticle>
        <LegalSection title="1. Objet">
          <p className="text-[var(--muted)]">
            Les présentes conditions générales d&apos;utilisation (CGU) régissent l&apos;accès et
            l&apos;utilisation de Garde-robe, application de gestion de garde-robe personnelle,
            éditée par {legalConfig.controllerName}.
          </p>
        </LegalSection>

        <LegalSection title="2. Acceptation">
          <p className="text-[var(--muted)]">
            En créant un compte, vous acceptez les présentes CGU et notre{" "}
            <Link
              href="/confidentialite"
              className="text-[var(--foreground)] underline-offset-2 hover:underline"
            >
              politique de confidentialité
            </Link>
            .
          </p>
        </LegalSection>

        <LegalSection title="3. Description du service">
          <p className="text-[var(--muted)]">
            Garde-robe permet de cataloguer vos vêtements et accessoires, composer des tenues et
            planifier leur port au calendrier. Le service est fourni en l&apos;état, sans garantie
            de disponibilité ininterrompue.
          </p>
        </LegalSection>

        <LegalSection title="4. Compte utilisateur">
          <ul className="list-disc space-y-2 pl-5 text-[var(--muted)]">
            <li>Vous êtes responsable de la confidentialité de vos identifiants</li>
            <li>Vous vous engagez à fournir une adresse e-mail valide</li>
            <li>Un seul compte par personne ; pas de partage de compte prévu</li>
            <li>
              Vous pouvez supprimer votre compte à tout moment depuis{" "}
              <Link href="/compte" className="text-[var(--foreground)] underline-offset-2 hover:underline">
                Mon compte
              </Link>
            </li>
          </ul>
        </LegalSection>

        <LegalSection title="5. Contenu utilisateur">
          <p className="text-[var(--muted)]">
            Vous conservez la propriété de vos photos et données. Vous nous accordez uniquement les
            droits techniques nécessaires pour héberger et afficher ce contenu dans le cadre du
            service. Vous vous engagez à ne pas téléverser de contenu illicite, diffamatoire ou
            portant atteinte aux droits de tiers.
          </p>
        </LegalSection>

        <LegalSection title="6. Usage acceptable">
          <p className="text-[var(--muted)]">
            Il est interdit de tenter d&apos;accéder aux données d&apos;autres utilisateurs, de
            perturber le fonctionnement du service, ou d&apos;utiliser Garde-robe à des fins
            commerciales non autorisées.
          </p>
        </LegalSection>

        <LegalSection title="7. Limitation de responsabilité">
          <p className="text-[var(--muted)]">
            Dans les limites autorisées par la loi, {legalConfig.controllerName} ne saurait être
            tenu responsable des dommages indirects, pertes de données imputables à des causes
            extérieures, ou interruptions de service. Nous vous recommandons d&apos;exporter
            régulièrement vos données depuis Mon compte.
          </p>
        </LegalSection>

        <LegalSection title="8. Résiliation">
          <p className="text-[var(--muted)]">
            Vous pouvez cesser d&apos;utiliser le service et supprimer votre compte à tout moment.
            Nous nous réservons le droit de suspendre un compte en cas de violation grave des
            présentes CGU, après notification lorsque cela est possible.
          </p>
        </LegalSection>

        <LegalSection title="9. Droit applicable">
          <p className="text-[var(--muted)]">
            Les présentes CGU sont soumises au droit français. En cas de litige, les tribunaux
            français seront compétents, sous réserve des dispositions impératives applicables aux
            consommateurs de l&apos;Union européenne.
          </p>
        </LegalSection>

        <LegalSection title="10. Contact">
          <p className="text-[var(--muted)]">
            Questions relatives aux CGU :{" "}
            <a
              href={`mailto:${legalConfig.contactEmail}`}
              className="text-[var(--foreground)] underline-offset-2 hover:underline"
            >
              {legalConfig.contactEmail}
            </a>
          </p>
        </LegalSection>
      </LegalArticle>
    </PageShell>
  );
}
