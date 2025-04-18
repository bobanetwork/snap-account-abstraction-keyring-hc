import React from 'react';
import { FaTwitter, FaDiscord, FaGithub, FaTelegram } from 'react-icons/fa';
import styled from 'styled-components';

import packageInfo from '../../package.json';
import Logo from '../assets/boba-logo-full.svg';

const FooterWrapper = styled.footer`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 2.4rem 4rem;
  background: ${({ theme }) => theme.colors.background?.alternative};
  border-top: 1px solid ${({ theme }) => theme.colors.border?.default};

  ${({ theme }) => theme.mediaQueries.small} {
    flex-direction: column;
    gap: 2rem;
    padding: 2rem;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;
`;

const CenterSection = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text?.muted};
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-weight: 500;

  ${({ theme }) => theme.mediaQueries.small} {
    text-align: center;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  ${({ theme }) => theme.mediaQueries.small} {
    width: 100%;
    justify-content: center;
  }
`;

const BobaLogo = styled.img`
  width: 100%;
  max-width: 120px;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

const SocialLink = styled.a`
  color: ${({ theme }) => theme.colors.text?.muted};
  font-size: 2rem;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: ${({ theme }) => theme.colors.primary?.default};
    transform: translateY(-2px);
  }
`;

const BottomBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.2rem;
  background: ${({ theme }) => theme.colors.background?.default};
  border-top: 1px solid ${({ theme }) => theme.colors.border?.default};
  color: ${({ theme }) => theme.colors.text?.muted};
  font-size: ${({ theme }) => theme.fontSizes.small};

  a {
    color: ${({ theme }) => theme.colors.text?.muted};
    margin: 0 0.8rem;
    text-decoration: none;
    transition: color 0.2s ease-in-out;

    &:hover {
      color: ${({ theme }) => theme.colors.primary?.default};
    }
  }
`;

export const Footer = () => {
  return (
    <>
      <FooterWrapper>
        <LeftSection>
          <BobaLogo src={Logo} alt="Boba Network Logo" />
        </LeftSection>
        <CenterSection>Powered by HybridCompute™</CenterSection>
        <RightSection>
          <SocialLink
            href="https://x.com/bobanetwork"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter />
          </SocialLink>
          <SocialLink
            href="https://discord.com/invite/Hvu3zpFwWd"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaDiscord />
          </SocialLink>
          <SocialLink
            href="https://github.com/bobanetwork"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
          </SocialLink>
          <SocialLink
            href="https://t.me/bobanetwork"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTelegram />
          </SocialLink>
        </RightSection>
      </FooterWrapper>
      <BottomBar>
        © {new Date().getFullYear()} Boba Network. All rights reserved. | v
        {packageInfo.version}
        {/* <a href="#">Terms</a>•<a href="#">Privacy</a> */}
      </BottomBar>
    </>
  );
};
