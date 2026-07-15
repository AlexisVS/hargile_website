# Audit feature (parked)

The "Audit your website" call-to-action was removed from the live site
(the floating `AuditButton` and the underlined hero CTA). The reusable
logic is kept here in case we want to bring it back.

## What's here
- `AuditButton.tsx` / `AuditButton.styled.js` — the floating CTA that
  opened the audit modal.

## How to re-enable
1. Render `<AuditButton/>` from `src/features/audit/AuditButton` inside
   `src/app/[locale]/(context)/layout.jsx` (it was previously placed
   next to `<RootClientWrapper>`'s children).
2. The modal wiring is still live: `site-navigation-provider` exposes
   `isAuditModalOpen` / `setIsAuditModalOpen`, and `AuditMultiModal` is
   still conditionally rendered in `(context)/(client)/layout.jsx`.
3. Translation keys `components.audit-button.*` are still present.
