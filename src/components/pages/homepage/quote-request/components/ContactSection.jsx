// src/components/pages/homepage/quote-request/components/ContactSection.js
// (Or your actual path)

import { Transition } from "@headlessui/react";
import {
  ContactInfoColumn,
  SectionTitle,
  FormGroup,
  InputLabel,
  RequiredMark,
  Input,
  TextArea,
  DropdownContainer,
  DropdownItem,
  StatusMessageDisplay
  // SelectButton, // Keep if Dropdown section is uncommented
} from "../quote-request-form.styled";
import { useDropdown } from "./useDropdown"; // Assuming this hook is used if dropdowns are active

// Define FieldErrorMessage here or import it
const FieldErrorMessage = ({ message }) =>
  message ? (
    <p
      style={{ color: "red", fontSize: "1em", marginTop: "0.25rem" }}
      className="error-message"
    >
      {message}
    </p>
  ) : null;

export function ContactSection({ t, register, errors, setValue, watch }) {

  return (
    <ContactInfoColumn>
      <SectionTitle>{t("contact.title")}</SectionTitle>

      {/* Paired rows keep the form short enough that the submit button sits
          above the fold on desktop. */}
      <div className="grid-cols-2">
        <FormGroup>
          <InputLabel htmlFor="name">
            {t("contact.name")} <RequiredMark>*</RequiredMark>
          </InputLabel>
          <Input
            id="name"
            type="text"
            $hasError={!!errors.name}
            {...register("name")}
          />
          <FieldErrorMessage message={errors.name?.message} />
        </FormGroup>

        <FormGroup>
          <InputLabel htmlFor="email">
            {t("contact.email")} <RequiredMark>*</RequiredMark>
          </InputLabel>
          <Input
            id="email"
            type="email"
            $hasError={!!errors.email}
            {...register("email")}
          />
          <FieldErrorMessage message={errors.email?.message} />
        </FormGroup>
      </div>

      <div className="grid-cols-2">
        <FormGroup>
          <InputLabel htmlFor="phone">{t("contact.phone")}</InputLabel>
          <Input
            id="phone"
            type="tel"
            $hasError={!!errors.phone}
            {...register("phone")}
          />
          <FieldErrorMessage message={errors.phone?.message} />
        </FormGroup>

        <FormGroup>
          <InputLabel htmlFor="object">
            {t("contact.object")} <RequiredMark>*</RequiredMark>{" "}
          </InputLabel>
          <Input
            id="object"
            type="text"
            $hasError={!!errors.object}
            {...register("object")}
          />
          <FieldErrorMessage message={errors.object?.message} />
        </FormGroup>
      </div>

      <FormGroup>
        <InputLabel htmlFor="description">
          {t("contact.projectDescription")} <RequiredMark>*</RequiredMark>
        </InputLabel>
        <TextArea
          id="description"
          rows={3}
          $hasError={!!errors.description}
          {...register("description")}
        />
        <FieldErrorMessage message={errors.description?.message} />
      </FormGroup>

      {/* Commented out dropdown sections remain the same */}
      {/* ... your commented out budget and timeline FormGroup ... */}
    </ContactInfoColumn>
  );
}

// Dropdown component remains the same
function Dropdown({ isOpen, options, onSelect }) {
  return (
    <Transition
      show={isOpen}
      enter="transition-opacity duration-75"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <DropdownContainer>
        {options.map((option) => (
          <DropdownItem
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
          >
            {option.label}
          </DropdownItem>
        ))}
      </DropdownContainer>
    </Transition>
  );
}
