import HomePageClient from "@/app/[locale]/(context)/(client)/HomePageClient";

/* Homepage with the wave grid forced as the hero backdrop, live.

   A route rather than only `?backdrop=wave` on `/` because this gets shown to
   people outside the team, and a query string on the production homepage is not
   a link you send round — it reads as a bug report. Grouped under /preview so
   the next comparison page has somewhere obvious to go.

   Everything below the hero is the real homepage, rendered from the same
   component: the point of the comparison is the hero, and a copy of the page
   would drift from it within a week.

   Deliberately no JsonLdForPage and no generatePageMetadata: both would assert
   this is a canonical page. It is a duplicate of `/` by construction, so the
   only correct signal is noindex.

   It stays out of the SEO surfaces by construction too — next-sitemap.config.js,
   scripts/validate-json-ld.mjs and llms.txt all enumerate their pages explicitly
   rather than discovering routes, so an unlisted route is already absent from
   all three. Nothing to remove; just nothing to add. */

export const metadata = {
    title: "Preview — homepage / wave hero",
    robots: {index: false, follow: false, nocache: true},
};

export default function HomeWavePreviewPage() {
    return <HomePageClient backdrop="wave"/>;
}
