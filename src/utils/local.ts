const AUTH_TOKEN = 'auth_token';
const EXPIRY_DATE = 'expiry_date';

export const getToken = () => localStorage?.getItem(AUTH_TOKEN);
export const setToken = (token: string) => localStorage?.setItem(AUTH_TOKEN, token);
export const deleteToken = () => localStorage?.removeItem(AUTH_TOKEN);

export const getExpDate = () => localStorage?.getItem(EXPIRY_DATE);
export const setExpDate = (date: Date) => localStorage?.setItem(EXPIRY_DATE, date.toISOString());
export const deleteExpDate = () => localStorage?.removeItem(EXPIRY_DATE);