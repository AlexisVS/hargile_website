import React from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { styled } from "styled-components";

export const HeaderContainer = styled.div`
  padding-top: 8vh;
  margin-bottom: 6vh;
  width: 100%;
`;

export const MainTitle = styled.h1.attrs({
    className: 'fluid-type-5'
})`
  color: var(--color-text-light);
  font-weight: 700;
  margin-bottom: 3.5rem;
`;

export const Divider = styled.div.attrs({
    className: 'fluid-type-5'
})`
  width: calc(18vh + 10vw);
  height: 0.5rem;
  background: #96b9f9;
  margin-bottom: 2.5rem;
`;

export const SubtitleItalic = styled.h2.attrs({
    className: 'fluid-type-3'
})`
  font-style: italic;
  font-weight: 300;
  color: var(--color-text-light);
  margin-bottom: 2rem;
`;

export const SubtitleBold = styled.h2.attrs({
    className: 'fluid-type-3'
})`
  font-weight: 760;
  color: var(--color-text-light);
  margin-bottom: 2rem;
`;

export const Description = styled.p.attrs({
    className: 'fluid-type-1'
})`
  color: rgb(180,180,180);
  max-width: 800px;
  line-height: 1.6;
`;
