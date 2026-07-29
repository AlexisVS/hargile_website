/* Canonical NAP (Name, Address, Phone) — the single source for the footer, the
   navbar and the JSON-LD organization node.

   Why this exists: answer engines cross-check the NAP they read in the copy
   against the NAP in the structured data, and a mismatch is worse than an
   absent field. Before this module the address lived in the message files, the
   phone was hardcoded in the navbar, and the schema had neither — three
   independent copies of a value whose entire purpose is to be identical
   everywhere. Add a fourth consumer here, never another literal.

   Locale-independent on purpose: a street address is not translated. The only
   translated part is the country name, which stays in
   `components.footer.address.country`. */
export const NAP = {
    street: "Rue Sterckx 5, bt. 28",
    postalCode: "1060",
    locality: "Saint-Gilles",
    region: "Brussels",
    countryCode: "BE",

    /* Same number, two renderings: E.164 for `tel:` and schema.org, spaced for
       the eye. Keep them in sync. */
    phone: "+32477045080",
    phoneDisplay: "+32 477 04 50 80",

    email: "contact@hargile.com",
};

/* "1060 Saint-Gilles" — the middle line of a Belgian postal address. */
export const napCityLine = `${NAP.postalCode} ${NAP.locality}`;
