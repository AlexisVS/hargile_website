import styled from "styled-components";
import { Facebook, Linkedin, Instagram, Github, Youtube } from "lucide-react";
import { useTranslations } from "next-intl";

const SocialMediaContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
  background-color: rgba(10, 5, 20, 0.5);
  border-radius: 0 0 1rem 1rem;
  margin-top: 2rem;
`;

const SocialMediaTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const IconsContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  max-width: 500px;
  margin: 0 auto;
`;

const SocialIconLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background-color: ${(props) => props.bgcolor || "#333"};
  border: 2px solid ${(props) => props.bordercolor || "transparent"};
  color: white;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
`;

export function SocialMedia() {
  const t = useTranslations("pages.contact.social");

  const socialLinks = [

    {
      name: "LinkedIn",
      icon: <Linkedin size={20} />,
      url: "https://www.linkedin.com/company/hargile",
      bgcolor: "rgba(14, 118, 168, 0.8)",
      bordercolor: "#0e76a8",
    },
    {
      name: "Instagram",
      icon: <Instagram size={20} />,
      url: "https://www.instagram.com/hargile_is/",
      bgcolor: "rgba(193, 53, 132, 0.8)",
      bordercolor: "#C13584",
    },
    {
      name: "Github",
      icon: <Github size={20} />,
      url: "https://github.com/HARGILE-tech-studio",
      bgcolor: "rgba(23, 105, 104, 0.8)",
      bordercolor: "#1769ff",
    },

  ];

  return (
    <SocialMediaContainer>
      <SocialMediaTitle>{t("title")}</SocialMediaTitle>
      <IconsContainer>
        {socialLinks.map((link) => (
          <SocialIconLink
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.name}
            bgcolor={link.bgcolor}
            bordercolor={link.bordercolor}
          >
            {link.icon}
          </SocialIconLink>
        ))}
      </IconsContainer>
    </SocialMediaContainer>
  );
}
