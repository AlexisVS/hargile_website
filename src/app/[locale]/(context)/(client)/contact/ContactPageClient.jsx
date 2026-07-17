"use client";

import ContactForm from "@/components/form/contact-form";

export default function ContactPageClient() {
    // ContactForm brings its own PageWrapper — wrapping it again here doubled
    // the background and stacked two blur orbs.
    return <ContactForm/>;
}
