/* eslint-disable no-nested-ternary prettier/prettier no-useless-return */
import { type KeyringAccount } from '@metamask/keyring-api';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import React, { useState } from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import styled from 'styled-components';

const AccountCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin: 12px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const AccountHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AccountInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AccountDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const AccountName = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text?.default};
`;

const AddressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.text?.muted};
  font-size: 14px;
`;

const CopyButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text?.muted};
  opacity: 0.6;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
`;

const TypeBadge = styled.span`
  background: ${({ theme }) => theme.colors.background?.alternative};
  color: ${({ theme }) => theme.colors.text?.alternative};
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.error?.default};
  opacity: 0;
  transition: opacity 0.2s ease;

  ${AccountCard}:hover & {
    opacity: 0.6;
  }

  &:hover {
    opacity: 1;
  }
`;

const truncateAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const Account = ({
  account,
  handleDelete,
  count,
  currentAccount,
}: {
  currentAccount?: any;
  account: KeyringAccount;
  handleDelete: (accountId: string) => Promise<void>;
  count: number;
}) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(account.address);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const isCurrentAccount =
    currentAccount?.address?.toLowerCase() === account.address.toLowerCase();

  return (
    <AccountCard>
      <AccountHeader>
        <AccountInfo>
          <Jazzicon diameter={40} seed={jsNumberForAddress(account.address)} />
          <AccountDetails>
            <AccountName>
              Account {count + 1}
              {isCurrentAccount && ' (Active)'}
            </AccountName>
            <AddressContainer>
              {truncateAddress(account.address)}
              <CopyButton
                onClick={handleCopy}
                title={copySuccess ? 'Copied!' : 'Copy address'}
              >
                <ContentCopyIcon fontSize="small" />
              </CopyButton>
            </AddressContainer>
            <AddressContainer>
              <TypeBadge>{account.type}</TypeBadge>
            </AddressContainer>
          </AccountDetails>
        </AccountInfo>
        <DeleteButton
          onClick={() => {
            handleDelete(account.id);
          }}
          title="Delete account"
        >
          <DeleteOutlineIcon />
        </DeleteButton>
      </AccountHeader>
    </AccountCard>
  );
};
