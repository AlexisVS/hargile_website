// src/components/form/contact-form.jsx
// (Adjust path as necessary for your project structure)

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";

// Styled Components and Child Components (Ensure paths are correct)
import { Header } from "@/components/header/mainHeader";
import {
  BendsBackdrop,
  FormContainer,
  FormGrid,
  PageWrapper,
  StatusMessageDisplay,
  SubmitButton,
} from "@/components/pages/homepage/quote-request/quote-request-form.styled";

// Client-only WebGL, kept out of the initial bundle — same vendored component
// as the homepage hero, dialed way down via BendsBackdrop's opacity/mask.
const ColorBends = dynamic(
  () => import("@/components/vendor/color-bends/ColorBends"),
  { ssr: false }
);

/* On phones the bands should sweep left→right across the screen rather than
   stacking top→bottom — near-horizontal rotation lays them along the width,
   the larger scale keeps fewer, broader bands in view (same treatment as the
   homepage hero's portrait mode). */
const useMobileBends = () => {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return mobile;
};
import { ContactSection } from "@/components/pages/homepage/quote-request/components/ContactSection";
import { PrivacyFooter } from "@/components/pages/homepage/quote-request/components/PrivacyFooter";

export default function ContactForm() {
  const t = useTranslations("components.contact-form");
  const mobileBends = useMobileBends();

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
    mode: "onBlur", // Validate on blur
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
      <BendsBackdrop aria-hidden="true">
        <ColorBends
          colors={["#2563eb", "#96b9f9"]}
          rotation={mobileBends ? 0 : 92}
          scale={mobileBends ? 1.7 : 1}
          speed={0.14}
          frequency={1.0}
          noise={0.02}
          bandWidth={1.35}
          iterations={1}
          intensity={0.72}
          mouseInfluence={0.3}
          parallax={0.25}
        />
      </BendsBackdrop>
      <FormContainer>
        <Header // Assuming Header component exists
          title={t("title")}
          titleAs={motion.h2} // Assuming motion h2
          description={t("description")}
          showUnderline={false}
          showBackgroundBlur={false}
        />
        <FormGrid onSubmit={handleSubmit(onSubmitForm)}>
          <ContactSection
            t={t}
            register={register} // Pass RHF register
            errors={errors} // Pass RHF errors for field-level feedback
            setValue={setValue}
            watch={watch}
          />
          <SubmitButton type="submit" disabled={isSubmittingAPI}>
            {isSubmittingAPI ? t("submitting") : t("submit")}
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
