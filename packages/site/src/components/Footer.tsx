import React from 'react';
import styled from 'styled-components';

import Logo from '../assets/boba-logo.png';

const FooterWrapper = styled.footer`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 1rem 0px;
  border-top: 1px solid ${(props) => props.theme.colors.border?.default};
`;

const BobaLogo = styled.img`
  width: 50px;
`;

const PoweredByButton = styled.a`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 1.2rem;
  border-radius: ${({ theme }) => theme.radii.button};
  box-shadow: ${({ theme }) => theme.shadows.button};
  background-color: ${({ theme }) => theme.colors.background?.alternative};
`;

export const Footer = () => {
  return (
    <FooterWrapper>
      <PoweredByButton href="https://docs.metamask.io/" target="_blank">
        <BobaLogo src={Logo} />
      </PoweredByButton>
    </FooterWrapper>
  );
};
