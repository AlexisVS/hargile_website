import {
  Checkbox,
  CheckboxContainer,
  CheckboxLabel,
  CheckMark,
  SectionTitle,
  ServiceDescription,
  ServiceTypesColumn,
  SubmitButton, // Assuming this is your styled submit button
} from "../quote-request-form.styled"; // Adjust path as necessary

const FieldErrorMessage = ({ message }) =>
  message ? (
    <p
      style={{
        color: "red",
        fontSize: "0.875rem",
        marginTop: "0.25rem",
        textAlign: "left",
      }}
    >
      {message}
    </p>
  ) : null;

export function ServicesSection({
  t,
  serviceCheckboxesState,
  toggleService,
  serviceIds,
  errors,
  isSubmitting,
}) {
  // Service configuration with colors (can be moved to a config file or kept here)
  // The 'id' here MUST match the keys in 'serviceCheckboxesState' and items in 'serviceIds'
  const serviceDisplayConfig = [
    {
      id: "advice",
      color: "yellow",
      bgColor: "rgba(255, 223, 8, 0.1)",
      hoverColor: "rgba(255, 223, 8, 0.15)",
    },
    {
      id: "webDevelopment",
      color: "blue",
      bgColor: "rgba(59, 130, 246, 0.1)",
      hoverColor: "rgba(59, 130, 246, 0.15)",
    },
    {
      id: "mobileApps",
      color: "purple",
      bgColor: "rgba(91, 141, 239, 0.1)",
      hoverColor: "rgba(91, 141, 239, 0.15)",
    },
    {
      id: "ai",
      color: "pink",
      bgColor: "rgba(245, 194, 107, 0.1)",
      hoverColor: "rgba(245, 194, 107, 0.15)",
    },
    {
      id: "cloud",
      color: "teal",
      bgColor: "rgba(20, 184, 166, 0.1)",
      hoverColor: "rgba(20, 184, 166, 0.15)",
    },
  ];

  return (
    <ServiceTypesColumn>
      <SectionTitle>{t("services.title")}</SectionTitle>
      <ServiceDescription>{t("services.description")}</ServiceDescription>

      <div
        className="service-options"
        role="group"
        aria-labelledby="services-title"
      >
        {" "}
        {/* ARIA for grouping */}
        {serviceDisplayConfig.map((service) => {
          // Ensure that only services defined in serviceIds (from parent state) are rendered
          if (!serviceIds.includes(service.id)) return null;

          return (
            <ServiceCheckbox
              key={service.id}
              id={service.id} // HTML id for label association (optional if label wraps input)
              label={t(`services.${service.id}`)} // e.g., services.webDevelopment
              isChecked={serviceCheckboxesState[service.id]}
              color={service.color}
              bgColor={
                serviceCheckboxesState[service.id]
                  ? service.bgColor
                  : "transparent"
              }
              hoverColor={service.hoverColor}
              onClick={() => toggleService(service.id)}
            />
          );
        })}
      </div>
      <FieldErrorMessage message={errors.services?.message} />

      <SubmitButton type="submit" disabled={isSubmitting}>
        {isSubmitting ? t("submitting") : t("submit")}
      </SubmitButton>
    </ServiceTypesColumn>
  );
}

// ServiceCheckbox component (from your original code, with minor accessibility improvements)
function ServiceCheckbox({
  id,
  label,
  isChecked,
  color,
  bgColor,
  hoverColor,
  onClick,
}) {
  return (
    <CheckboxContainer
      style={{
        "--bg-color": bgColor,
        "--bg-hover-color": hoverColor,
      }}
      onClick={onClick} // Main click handler
      role="checkbox" // ARIA role
      aria-checked={isChecked} // ARIA state
      tabIndex={0} // Make it focusable
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onClick();
        }
      }} // Keyboard accessibility
    >
      <Checkbox // This is more like a visual indicator now
        type="button" // Prevents form submission if it were a real button inside a form
        aria-hidden="true" // The container handles ARIA for the checkbox role
        checked={isChecked}
        color={color}
        // onClick={(e) => { e.stopPropagation(); onClick(); }} // onClick on container is sufficient
      >
        {isChecked && (
          <CheckMark
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </CheckMark>
        )}
      </Checkbox>
      <CheckboxLabel htmlFor={id}>{label}</CheckboxLabel>{" "}
      {/* Associate label with an input if Checkbox were a real input */}
    </CheckboxContainer>
  );
}
