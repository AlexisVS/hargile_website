/* The off-site profiles that corroborate this entity. Same rationale as
   @/lib/nap: engines resolve an organisation by cross-checking independent
   sources, so this list has to say exactly the same thing wherever it appears
   — the JSON-LD `sameAs`, llms.txt, and any directory profile we fill in.
   One list, several consumers; never a second literal.

   Only profiles we actually control and keep current. A dead handle is worse
   than an absent one: it is a source that disagrees with the others. That is
   why the X/Twitter handle was removed in v0.19.2 rather than added here. */
export const SAME_AS = [
    "https://www.linkedin.com/company/hargile",
    "https://www.instagram.com/hargile_tech_studio/",
    "https://github.com/HARGILE-tech-studio",
];
