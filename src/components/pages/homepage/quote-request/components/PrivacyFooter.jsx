import {
  PrivacyNote,
  PrivacyLink,
  RequiredNote,
  RequiredMark,
} from "../quote-request-form.styled";

export function PrivacyFooter({ t }) {
  return (
    <PrivacyNote>
      <p>
        {t("privacy.text")}{" "}
        <PrivacyLink href="#">{t("privacy.link")}</PrivacyLink>.
      </p>
      <RequiredNote>
        <RequiredMark>*</RequiredMark> {t("privacy.requiredFields")}
      </RequiredNote>
    </PrivacyNote>
  );
}
