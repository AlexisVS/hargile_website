// src/components/form/contact-form.jsx
// (Adjust path as necessary for your project structure)

import { useTranslations } from "next-intl";
import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";

// Styled Components and Child Components (Ensure paths are correct)
import { Header } from "@/components/header/mainHeader";
import {
  BackdropSlot,
  FormContainer,
  FormGrid,
  PageWrapper,
  StatusMessageDisplay,
  SubmitButton,
} from "@/components/pages/homepage/quote-request/quote-request-form.styled";

/* The cube grid, replacing the ColorBends canvas that used to run here.
   Not lazy and not WebGL any more: what ships is one exported still per aspect
   band, so there is no chunk to defer and nothing to compile. See
   contact-backdrop.jsx — the live three.js path still exists behind ?wave= and
   ?export=, which is how the frames get chosen and captured. */
import ContactBackdrop from "@/components/pages/contact/contact-backdrop";
import { ProseContactSection } from "@/components/pages/homepage/quote-request/components/ProseContactSection";
import { PrivacyFooter } from "@/components/pages/homepage/quote-request/components/PrivacyFooter";
import { useHeroLoading } from "@/components/providers/hero-loading-provider";

export default function ContactForm() {
  const t = useTranslations("components.contact-form");

  /* Same contract as before — tell the layout-level loader once the backdrop
     has painted, so the page is revealed with it already in place — but the
     signal moved. It used to watch for a <canvas> appearing, because the bends
     were WebGL; the grid is an <img>, so there is no canvas to wait for and
     that watcher would never have fired. HeroLoadingProvider covers "/" and
     "/contact" and falls back to a 2.5s SAFETY_MS, so the symptom would not
     have been a stuck page — it would have been every contact load sitting
     behind the overlay for the full two and a half seconds. */
  const { markHeroReady } = useHeroLoading();
  const readyRef = useRef(false);
  const onBackdropReady = useCallback(() => {
    if (readyRef.current) return;
    readyRef.current = true;
    // Two rAFs: onLoad fires when the image is decoded, this waits until it has
    // actually been composited, which is what the canvas path also promised.
    requestAnimationFrame(() => requestAnimationFrame(() => markHeroReady()));
  }, [markHeroReady]);

  // Define Zod Schema based on your form fields
  // Ensure field names match the 'name' prop used in register (e.g., 'description')
  const MIN_MESSAGE_CHARS = 10;

  const contactFormSchema = z.object({
    name: z.string().min(1, { error: t("validation.nameRequired") }),
    email: z
      .string()
      .min(1, { error: t("validation.emailRequired") })
      .pipe(z.email({ error: t("validation.emailInvalid") })),
    phone: z.string().trim().optional().or(z.literal("")),
    object: z.string().min(1, { error: t("validation.objectRequired") }),

    // Schema for the main text area field, named 'description'
    description: z
      .string()
      .optional()
      .transform((val) => {
        const valueToProcess = val === undefined ? "" : val;
        return valueToProcess.trim();
      })
      .pipe(
        z.string().min(MIN_MESSAGE_CHARS, {
          error: t("validation.messageRequired", { min: MIN_MESSAGE_CHARS }), // Using 'messageRequired' key for description
        })
      ),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid }, // isSubmitting is RHF's internal state during validation/submission
    setValue,
    reset,
    watch, // Still useful for debugging specific field values if needed
    // getValues, // Removed debugging function
    // touchedFields, // Removed debugging formState
    // dirtyFields, // Removed debugging formState
  } = useForm({
    resolver: zodResolver(contactFormSchema),
    // Errors only surface on submit; once shown, they clear live as the
    // user fixes the field (default reValidateMode: onChange).
    mode: "onSubmit",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      object: "",
      description: "", // Ensure this matches the field name in schema and register
    },
  });

  // State for the API submission status message
  const [submitStatus, setSubmitStatus] = useState({
    success: null, // true, false, or null (initial/pending)
    message: "", // The translated message to display
  });
  const [isSubmittingAPI, setIsSubmittingAPI] = useState(false); // State to control button disable if API call is in progress

  const onSubmitForm = async (data) => {
    setIsSubmittingAPI(true); // Indicate API call is starting
    setSubmitStatus({ success: null, message: "" }); // Clear previous status

    // Data is already validated by Zod based on contactFormSchema
    // console.log("[ContactForm SUBMIT] Validated data:", data);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data), // Send the validated data object
      });

      const result = await response.json(); // Expect { success: boolean, messageKey: string, field?, values? }

      if (response.ok && result.success === true) {
        setSubmitStatus({
          success: true,
          // Use t() with the messageKey from the API
          message: t(result.messageKey),
        });
        reset(); // Reset form fields to defaultValues
      } else {
        let errorMessage;
        // Check if API returned a message key for translation
        if (result.messageKey) {
          // If validation error, pass 'values' for interpolation (like min chars)
          errorMessage = t(result.messageKey, result.values || {});
        } else {
          // Fallback to a generic error message if no key provided
          errorMessage = t("submitError");
        }
        setSubmitStatus({
          success: false,
          message: errorMessage,
        });

      }
    } catch (error) {
      setSubmitStatus({ success: false, message: t("submitNetworkError") });
    } finally {
      setIsSubmittingAPI(false); // Indicate API call is finished
    }
  };

  return (
    <PageWrapper>
      <BackdropSlot aria-hidden="true">
        <ContactBackdrop onReady={onBackdropReady} />
      </BackdropSlot>
      <FormContainer>
        {/* titleAs is h1, not h2: this is the page's main heading and /contact
            had no h1 at all. Styling comes from PageTitle's `as` prop, so the
            tag change is invisible. */}
        <Header
          title={t("title")}
          titleAs={motion.h1}
          description={t("description")}
          showUnderline={false}
          showBackgroundBlur={false}
        />
        <FormGrid onSubmit={handleSubmit(onSubmitForm)}>
          <ProseContactSection t={t} register={register} errors={errors} />
          <SubmitButton type="submit" disabled={isSubmittingAPI}>
            {isSubmittingAPI ? t("submitting") : t("submit")}
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M6 3.5 10.5 8 6 12.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </SubmitButton>
        </FormGrid>

        <StatusMessageDisplay
          $show={!!submitStatus.message}
          $success={submitStatus.success}
        >
          {submitStatus.message}
        </StatusMessageDisplay>
        <PrivacyFooter t={t} />
      </FormContainer>
    </PageWrapper>
  );
}
