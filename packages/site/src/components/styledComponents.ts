import Box from '@mui/material/Box';
import styled, { keyframes, css } from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem;
  flex: 1;
  max-width: 120rem;
  margin: 0 auto;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.small} {
    padding: 2rem;
  }
`;

export const StyledBox = styled(Box)`
  width: 100%;
  max-width: 120rem;
  margin: 0 auto;
`;

export const StyledIcon = styled.span`
  width: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
`;

export const InformationBox = styled.div<{ error: boolean }>`
  display: flex;
  background-color: ${({ error }) => (error ? '#B22222' : '#50c878')};
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
`;

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: ${({ theme }) => theme.colors.border?.default};
  margin: 2.4rem 0;
`;

export const DividerTitle = styled.p`
  margin: 0;
  font-size: 25px;
  margin-bottom: 3rem;
`;

export const CardContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2.4rem;
  width: 100%;
  padding: 2.4rem 0;

  ${({ theme }) => theme.mediaQueries.small} {

    gap: 1.6rem;
    padding: 1.6rem 0;
  }
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2.4rem;
  border-radius: ${({ theme }) => theme.radii.card};
  background: ${({ theme }) => theme.colors.card?.default};
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.default};
  }
`;

export const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error?.muted};
  border: 1px solid ${({ theme }) => theme.colors.error?.default};
  color: ${({ theme }) => theme.colors.error?.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin: 2.4rem 0;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin: 1.6rem 0;
  }
`;

export const Heading = styled.h1`
  color: ${({ theme }) => theme.colors.text?.default};
  text-align: center;
  margin-bottom: 2.4rem;
  font-size: ${({ theme }) => theme.fontSizes.heading};
  font-weight: 700;
  line-height: 1.2;

  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.mobileHeading};
    margin-bottom: 1.6rem;
  }
`;

export const SubHeading = styled.h2`
  color: ${({ theme }) => theme.colors.text?.muted};
  text-align: center;
  margin-bottom: 4rem;
  font-size: ${({ theme }) => theme.fontSizes.title};
  font-weight: 500;
  line-height: 1.5;
  max-width: 64rem;

  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.large};
    margin-bottom: 2.4rem;
  }
`;

export const AccountTitleContainer = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0px;
  cursor: pointer;
`;

export const AccountTitle = styled.p`
  color: ${({ theme }) => theme.colors.text?.default};
  font-size: ${({ theme }) => theme.fontSizes.text};
  font-weight: 500;
  line-height: 1.5;
  margin: 0;
`;

export const AccountTitleIconContainer = styled.div`
  display: flex;
`;

export const AccountContainer = styled(Card)`
  gap: 1.6rem;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary?.default};
  }
`;

export const AccountRow = styled.div<{
  alignItems?: string;
  flexDirection?: string;
}>`
  display: flex;
  flex-direction: ${({ flexDirection }) => flexDirection ?? 'column'};
  flex: 1;
  width: 100%;
  align-items: ${({ alignItems }) => alignItems ?? 'stretch'};
`;

const copyKeyframe = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

export const CopyableContainer = styled.div<{ active: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: 4px 12px;
  align-items: center;
  gap: 4px;
  flex: 1 0 0;
  border-radius: 4px;
  background: rgba(3, 118, 201, 0.1);
  overflow-x: wrap;
  animation: ${({ active }) =>
    active
      ? css`
          ${copyKeyframe} 0.2s linear
        `
      : 'none'};
`;

export const CopyableItemValue = styled.div`
  color: #0376c9;
  text-align: left;
  max-width: 80%;
  word-break: break-all;
  white-space: pre-wrap;
  margin: 0px;

  /* Body-SM-Medium */
  font-family: Roboto Mono, ui-monospace;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 166.667% */
  letter-spacing: 0.25px;
`;

export const AccountRowTitle = styled.p`
  color: #000;

  /* H6 - Bold 14px */
  font-family: Euclid Circular B, ui-sans-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 140.625%; /* 19.688px */
  margin-bottom: 4px;
`;

export const AccountRowValue = styled.p`
  margin: 0px;
  color: #6a737d;

  /* H6 - Normal 14px */
  font-family: Euclid Circular B, ui-sans-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 140.625%; /* 19.688px */

  li {
    list-style-type: disc;
  }
`;

export const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.4rem;
  width: 100%;
  margin: 4rem 0;

  ${({ theme }) => theme.mediaQueries.small} {
    grid-template-columns: 1fr;
    gap: 1.6rem;
    margin: 2.4rem 0;
  }
`;

export const FeatureCard = styled(Card)`
  align-items: center;
  text-align: center;
  gap: 1.6rem;
  padding: 3.2rem 2.4rem;

  svg {
    width: 4.8rem;
    height: 4.8rem;
    color: ${({ theme }) => theme.colors.primary?.default};
  }

  h3 {
    font-size: ${({ theme }) => theme.fontSizes.large};
    font-weight: 600;
    margin: 0;
  }

  p {
    color: ${({ theme }) => theme.colors.text?.muted};
    font-size: ${({ theme }) => theme.fontSizes.text};
    margin: 0;
  }
`;
