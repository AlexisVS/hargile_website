import HomePageClient from "@/app/[locale]/(context)/(client)/HomePageClient";

/* The homepage, rendered for the wave-grid export script.

   It began as a comparison route — the homepage with the wave grid forced while
   `/` still resolved cubes or colour bends by viewport. That comparison was
   decided, the wave grid became the hero's only backdrop, and this page stopped
   being a preview of anything: it renders exactly what `/` renders.

   It is kept anyway, for one reason found the hard way: **`scripts/export-wave-grid.mjs`
   drives it, and pointing that script at `/` instead does not work.** Driving `/`
   left `agent-browser open` waiting indefinitely and no image was ever written,
   where this route captures in about half a minute. The likely difference is the
   branded loader overlay, which HeroLoadingProvider mounts on `/` and `/contact`
   only — but the cause was not pinned down, so treat the route as load-bearing
   rather than as scaffolding. Deleting it breaks `npm run images:wavegrid:home`,
   which is how the sub-1024px hero image is made.

   Everything below the hero is the real homepage, rendered from the same
   component, so this cannot drift from what it exports.

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
    return <HomePageClient/>;
}
