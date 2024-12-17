import { getLocalStorage, setLocalStorage } from './localStorage';

/**
 * Get the user's preferred theme in local storage.
 * Will default to the browser's preferred theme if there is no value in local storage.
 *
 * @returns True if the theme is "dark" otherwise, false.
 */
export const getThemePreference = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  const localStoragePreference = getLocalStorage('theme');
  const systemPreference = 'light'; // stick with light for now
  const preference = localStoragePreference ?? systemPreference;

  if (!localStoragePreference) {
    setLocalStorage('theme', 'light');
  }

  return preference === 'dark';
};
