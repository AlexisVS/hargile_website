import {
  PrivacyNote,
  PrivacyLink,
  RequiredNote,
  RequiredMark,
} from "../../homepage/quote-request/quote-request-form.styled";

export function PrivacyFooter({ t }) {
  return (
    <PrivacyNote>
      <p>
        {t("privacy.text")}{" "}
        <PrivacyLink href="/legal/privacy-policy">{t("privacy.link")}</PrivacyLink>.
      </p>
      <RequiredNote>
        <RequiredMark>*</RequiredMark> {t("privacy.requiredFields")}
      </RequiredNote>
    </PrivacyNote>
  );
}
