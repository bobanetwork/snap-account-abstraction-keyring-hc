import type { DefaultTheme } from 'styled-components';
import { createGlobalStyle } from 'styled-components';

const breakpoints = ['600px', '768px', '992px'] as const;

/**
 * Common theme properties.
 */
const theme = {
  fonts: {
    default:
      'Euclid Circular B, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    code: 'ui-monospace, Menlo, Monaco, "Cascadia Mono", "Segoe UI Mono", "Roboto Mono", monospace',
  },
  fontSizes: {
    heading: '5.2rem',
    mobileHeading: '3.6rem',
    title: '2.4rem',
    large: '2rem',
    text: '1.6rem',
    small: '1.4rem',
  },
  radii: {
    default: '24px',
    button: '8px',
    card: '16px',
  },
  breakpoints: [...breakpoints],
  mediaQueries: {
    small: `@media screen and (max-width: ${breakpoints[0]})`,
    medium: `@media screen and (min-width: ${breakpoints[1]})`,
    large: `@media screen and (min-width: ${breakpoints[2]})`,
  },
  shadows: {
    default: '0px 7px 42px rgba(0, 0, 0, 0.1)',
    button: '0px 2px 40px rgba(0, 0, 0, 0.1)',
    card: '0px 8px 32px rgba(0, 0, 0, 0.08)',
  },
};

/**
 * Light theme color properties.
 */
export const light: DefaultTheme = {
  colors: {
    background: {
      default: '#FFFFFF',
      alternative: '#F8F9FA',
      inverse: '#aedb02',
      gradient: 'linear-gradient(135deg, #0052FF 0%, #1E88E5 100%)',
    },
    icon: {
      default: '#aedb02',
      alternative: '#BBC0C5',
    },
    text: {
      default: '#24272A',
      muted: '#6A737D',
      alternative: '#535A61',
      inverse: '#000000',
    },
    border: {
      default: '#E5E8EB',
    },
    primary: {
      default: '#aedb02',
      inverse: '#000000',
    },
    card: {
      default: '#FFFFFF',
    },
    error: {
      default: '#d73a49',
      alternative: '#b92534',
      muted: '#d73a4919',
    },
    success: {
      default: '#28a745',
      alternative: '#22863a',
      muted: '#28a74519',
    },
  },
  ...theme,
};

/**
 * Dark theme color properties
 */
export const dark: DefaultTheme = {
  colors: {
    background: {
      default: '#1A1B1F',
      alternative: '#141618',
      inverse: '#aedb02',
      gradient: 'linear-gradient(135deg, #0052FF 0%, #1E88E5 100%)',
    },
    icon: {
      default: '#aedb02',
      alternative: '#BBC0C5',
    },
    text: {
      default: '#FFFFFF',
      muted: '#D6D9DC',
      alternative: '#BBC0C5',
      inverse: '#1A1B1F',
    },
    border: {
      default: '#2D2F34',
    },
    primary: {
      default: '#aedb02',
      inverse: '#000000',
    },
    card: {
      default: '#24272A',
    },
    error: {
      default: '#d73a49',
      alternative: '#b92534',
      muted: '#d73a4919',
    },
    success: {
      default: '#28a745',
      alternative: '#22863a',
      muted: '#28a74519',
    },
  },
  ...theme,
};

const GlobalStyles = createGlobalStyle`
  html {
    font-size: 62.5%;
  }

  body {
    background-color: ${(props) => props.theme.colors.background?.default};
    color: ${(props) => props.theme.colors.text?.default};
    font-family: ${(props) => props.theme.fonts.default};
    font-size: ${(props) => props.theme.fontSizes.text};
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    box-sizing: border-box;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${(props) => props.theme.fonts.default};
    font-weight: 700;
    margin: 0;
    padding: 0;
  }

  h1 {
    font-size: ${(props) => props.theme.fontSizes.heading};
    line-height: 1.2;
    ${(props) => props.theme.mediaQueries.small} {
      font-size: ${(props) => props.theme.fontSizes.mobileHeading};
    }
  }

  code {
    background-color: ${(props) => props.theme.colors.background?.alternative};
    font-family: ${(props) => props.theme.fonts.code};
    padding: 1.2rem;
    font-weight: normal;
    font-size: ${(props) => props.theme.fontSizes.text};
    border-radius: ${(props) => props.theme.radii.button};
  }

  button {
    font-family: ${(props) => props.theme.fonts.default};
    font-size: ${(props) => props.theme.fontSizes.small};
    font-weight: 600;
    border-radius: ${(props) => props.theme.radii.button};
    background-color: ${(props) => props.theme.colors.primary?.default};
    color: ${(props) => props.theme.colors.primary?.inverse};
    border: 1px solid ${(props) => props.theme.colors.primary?.default};
    padding: 1.2rem 2.4rem;
    min-height: 4.2rem;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, color 0.2s ease-in-out;

    &:hover {
      background-color: transparent;
      border: 1px solid ${(props) => props.theme.colors.primary?.default};
      color: ${(props) => props.theme.colors.primary?.default};
    }

    &:disabled,
    &[disabled] {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &:disabled:hover,
    &[disabled]:hover {
      background-color: ${(props) => props.theme.colors.primary?.default};
      color: ${(props) => props.theme.colors.primary?.inverse};
      border: 1px solid ${(props) => props.theme.colors.primary?.default};
    }
  }

  a {
    color: ${(props) => props.theme.colors.primary?.default};
    text-decoration: none;
    transition: color 0.2s ease-in-out;

    &:hover {
      color: ${(props) => props.theme.colors.text?.default};
    }
  }
`;

export { GlobalStyles as GlobalStyle };
