import type { ComponentProps } from 'react';
import React from 'react';
import styled from 'styled-components';

import { ReactComponent as MetaMaskFox } from '../assets/metamask_fox.svg';
import type { MetamaskState } from '../hooks';
import { shouldDisplayReconnectButton } from '../utils';

const Link = styled.a`
  display: flex;
  align-self: flex-start;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => props.theme.fontSizes.small};
  border-radius: ${(props) => props.theme.radii.button};
  border: 1px solid ${(props) => props.theme.colors.background?.inverse};
  background-color: ${(props) => props.theme.colors.background?.inverse};
  color: ${(props) => props.theme.colors.text?.inverse};
  text-decoration: none;
  font-weight: bold;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: transparent;
    border: 1px solid ${(props) => props.theme.colors.background?.inverse};
    color: ${(props) => props.theme.colors.text?.default};
  }

  ${({ theme }) => theme.mediaQueries.small} {
    width: 100%;
    box-sizing: border-box;
  }
`;

const Button = styled.button`
  display: flex;
  align-self: flex-start;
  align-items: center;
  justify-content: center;
  margin-top: auto;

  ${({ theme }) => theme.mediaQueries.small} {
    width: 100%;
  }
`;

const ButtonText = styled.span`
  margin-left: 1rem;
`;

const ConnectedContainer = styled.div`
  display: inline-flex;
  align-self: flex-start;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => props.theme.fontSizes.small};
  border-radius: ${(props) => props.theme.radii.button};
  border: 1px solid ${(props) => props.theme.colors.background?.inverse};
  background-color: ${(props) => props.theme.colors.background?.inverse};
  color: ${(props) => props.theme.colors.text?.inverse};
  font-weight: bold;
  padding: 1.2rem;
  margin-right: 1rem;
  margin-left: 1rem;
`;

const ConnectedIndicator = styled.div`
  content: ' ';
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: green;
`;

type ActionButtonProps = {
  width?: string;
  margin?: string;
};

const ActionButton = styled.button<ActionButtonProps>`
  width: ${(props) => props.width};

  border-radius: 999px;
  border: none;
  padding: 5px 20px;
  margin: ${(props) => props.margin};

  &:hover {
    background-color: #0376ff;
    border: none;
    color: #fff;
  }
`;

ActionButton.defaultProps = {
  width: '95%',
  margin: '8px 8px 8px 8px',
};

export const InstallMetaMaskButton = () => (
  <Link href="https://metamask.io/" target="_blank">
    <MetaMaskFox />
    <ButtonText>Install MetaMask</ButtonText>
  </Link>
);

export const InstallHcSnapButton = (props: ComponentProps<typeof Button>) => {
  return (
    <Button id="connectButton" {...props}>
      <MetaMaskFox />
      <ButtonText>Install Snap & Connect</ButtonText>
    </Button>
  );
};
export const ConnectButton = (props: ComponentProps<typeof Button>) => {
  return (
    <Button id="connectButton" {...props}>
      <MetaMaskFox />
      <ButtonText>Connect Snap</ButtonText>
    </Button>
  );
};

export const ReloadButton = (props: ComponentProps<typeof Button>) => {
  return (
    <Button id="Reload Button" {...props}>
      <ButtonText>Reload App</ButtonText>
    </Button>
  );
};

export const ReconnectButton = (props: ComponentProps<typeof Button>) => {
  return (
    <Button {...props}>
      <MetaMaskFox />
      <ButtonText>Reconnect</ButtonText>
    </Button>
  );
};

export const UpdateButton = (props: ComponentProps<typeof Button>) => {
  return (
    <Button id="updateButton" {...props}>
      <MetaMaskFox />
      <ButtonText>Update</ButtonText>
    </Button>
  );
};

export const SendHelloButton = (props: ComponentProps<typeof Button>) => {
  return <Button {...props}>Send message</Button>;
};

export const HeaderButtons = ({
  state,
  updateAvailable,
  onConnectClick,
}: {
  state: MetamaskState;
  updateAvailable: boolean;
  onConnectClick(): unknown;
}) => {
  const getNetworkName = () => {
    if (window.ethereum.networkVersion === '28882') {
      return 'Boba Sepolia';
    } else if (window.ethereum.networkVersion === '288') {
      return 'Boba Mainnet';
    }
    return 'Other Network';
  };

  if (!state.hasMetaMask && !state.installedSnap) {
    return <InstallMetaMaskButton />;
  }

  if (!state.installedSnap) {
    return <InstallHcSnapButton onClick={onConnectClick} />;
  }

  if (!state.isBobaSepolia) {
    return <ConnectButton onClick={onConnectClick} />;
  }

  if (updateAvailable) {
    return <UpdateButton onClick={onConnectClick} />;
  }

  if (shouldDisplayReconnectButton(state.installedSnap)) {
    return <ReconnectButton onClick={onConnectClick} />;
  }

  return (
    <div>
      <div>
        <ConnectedContainer>
          <ConnectedIndicator />
          <ButtonText id="snapConnected">
            Connected to: {getNetworkName()}
          </ButtonText>
        </ConnectedContainer>
      </div>
    </div>
  );
};

export const MethodButton = (props: any) => {
  return (
    <ActionButton
      disabled={props.disabled}
      onClick={props.onClick}
      width={props.width}
      margin={props.margin}
    >
      {props.label}
    </ActionButton>
  );
};
