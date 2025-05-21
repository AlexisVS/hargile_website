// src/components/form/contact-form.jsx
// (Adjust path as necessary for your project structure)

import { useTranslations } from "next-intl";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";

// Styled Components and Child Components (Ensure paths are correct)
import { Header } from "@/components/header/mainHeader";
import {
  BackgroundBlur,
  FormContainer,
  FormGrid,
  PageWrapper,
  // Import the new styled component for status messages
  StatusMessageDisplay,
} from "@/components/pages/homepage/quote-request/quote-request-form.styled";
import { ContactSection } from "@/components/pages/homepage/quote-request/components/ContactSection";
import { ServicesSection } from "@/components/pages/homepage/quote-request/components/ServicesSection";
import { PrivacyFooter } from "@/components/pages/homepage/quote-request/components/PrivacyFooter";

export default function ContactForm() {
  const t = useTranslations("components.contact-form");

  // Define Zod Schema based on your form fields
  // Ensure field names match the 'name' prop used in register (e.g., 'description')
  const MIN_MESSAGE_CHARS = 10;

  const contactFormSchema = z.object({
    name: z.string().min(1, { message: t("validation.nameRequired") }),
    email: z
      .string()
      .min(1, { message: t("validation.emailRequired") })
      .email({ message: t("validation.emailInvalid") }),
    phone: z.string().trim().optional().or(z.literal("")),
    object: z.string().min(1, { message: t("validation.objectRequired") }),

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
          message: t("validation.messageRequired", { min: MIN_MESSAGE_CHARS }), // Using 'messageRequired' key for description
        })
      ),

    services: z
      .array(z.string())
      .min(1, { message: t("validation.serviceRequired") }),
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
      services: [],
    },
  });

  // --- Removed debugging useEffects for watch, errors, getValues ---

  const initialServiceCheckboxesState = {
    advice: false,
    webDevelopment: false,
    mobileApps: false,
    ai: false,
    cloud: false,
  };
  const [activeServiceCheckboxes, setActiveServiceCheckboxes] = useState(
    initialServiceCheckboxesState
  );
  const serviceIds = Object.keys(initialServiceCheckboxesState);

  const toggleService = useCallback(
    (serviceId) => {
      setActiveServiceCheckboxes((prev) => {
        const newState = { ...prev, [serviceId]: !prev[serviceId] };
        const selectedServiceIds = Object.entries(newState)
          .filter(([_, isSelected]) => isSelected)
          .map(([id, _]) => id);
        // ShouldValidate triggers Zod resolver, shouldDirty/Touch mark field state
        setValue("services", selectedServiceIds, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
        return newState;
      });
    },
    [setValue] // setValue is a stable function from RHF
  );

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
        setActiveServiceCheckboxes(initialServiceCheckboxesState); // Manually reset custom checkbox UI state
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
      <BackgroundBlur />
      <FormContainer>
        <Header // Assuming Header component exists
          title={t("title")}
          titleAs={motion.h2} // Assuming framer-motion h2
          description={t("description")}
          showUnderline={true}
          showBackgroundBlur={false}
        />
        <FormGrid onSubmit={handleSubmit(onSubmitForm)}>
          {" "}
          <ContactSection
            t={t}
            register={register} // Pass RHF register
            errors={errors} // Pass RHF errors for field-level feedback
            setValue={setValue}
            watch={watch}
          />
          <ServicesSection
            t={t}
            serviceCheckboxesState={activeServiceCheckboxes} // Pass local UI state
            toggleService={toggleService} // Pass function to update UI state and RHF
            serviceIds={serviceIds} // Pass list of service IDs
            errors={errors} // Pass RHF errors for services validation feedback
            isSubmitting={isSubmittingAPI} // Pass API submission state to disable button
          />
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
