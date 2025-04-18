import React from 'react';
import styled from 'styled-components';

const GuideContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #1a1b1f;
  margin-bottom: 1.5rem;
  font-size: 2rem;
`;

const Description = styled.p`
  color: #6c757d;
  margin-bottom: 2rem;
  line-height: 1.6;
  font-size: 1.1rem;
`;

const StepsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  margin-bottom: 2rem;
`;

const Step = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  text-align: left;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

const StepNumber = styled.div`
  background: #007bff;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepTitle = styled.h3`
  color: #1a1b1f;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
`;

const StepDescription = styled.p`
  color: #6c757d;
  margin: 0;
  font-size: 1rem;
`;

const DownloadButton = styled.a`
  display: inline-block;
  background: #007bff;
  color: white;
  text-decoration: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  transition: background 0.2s;

  &:hover {
    background: #0056b3;
  }
`;

const BrowserList = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const BrowserButton = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  background: #f8f9fa;
  color: #1a1b1f;
  text-decoration: none;
  transition: background 0.2s;

  &:hover {
    background: #e9ecef;
  }
`;

const MetaMaskGuide: React.FC = () => {
  return (
    <GuideContainer>
      <Title>Install MetaMask to Continue</Title>
      <Description>
        MetaMask is a secure wallet that lets you interact with Web3 applications.
        You'll need it to use our Account Abstraction features.
      </Description>

      <StepsContainer>
        <Step>
          <StepNumber>1</StepNumber>
          <StepContent>
            <StepTitle>Install MetaMask</StepTitle>
            <StepDescription>
              Click the button below to download and install MetaMask for your browser.
            </StepDescription>
          </StepContent>
        </Step>

        <Step>
          <StepNumber>2</StepNumber>
          <StepContent>
            <StepTitle>Create or Import a Wallet</StepTitle>
            <StepDescription>
              Follow MetaMask's setup guide to create a new wallet or import an existing one.
            </StepDescription>
          </StepContent>
        </Step>

        <Step>
          <StepNumber>3</StepNumber>
          <StepContent>
            <StepTitle>Return to This Page</StepTitle>
            <StepDescription>
              Once MetaMask is installed, refresh this page to continue with Account Abstraction.
            </StepDescription>
          </StepContent>
        </Step>
      </StepsContainer>

      <DownloadButton
        href="https://metamask.io/download/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Download MetaMask
      </DownloadButton>

      <BrowserList>
        <BrowserButton
          href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
          target="_blank"
          rel="noopener noreferrer"
        >
          Chrome
        </BrowserButton>
        <BrowserButton
          href="https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Firefox
        </BrowserButton>
        <BrowserButton
          href="https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm"
          target="_blank"
          rel="noopener noreferrer"
        >
          Edge
        </BrowserButton>
      </BrowserList>
    </GuideContainer>
  );
};

export default MetaMaskGuide;
