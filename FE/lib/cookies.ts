// lib/cookies.ts
export const setCookie = (name: string, value: string, days = 1) => {
    const expires = new Date(Date.now() + days * 86400e3).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

export const getCookie = (name: string) => {
    return document.cookie.split('; ').find(row => row.startsWith(`${name}=`))?.split('=')[1];
};
// utils/cookies.ts
export const verifyAuth = () => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    const role = document.cookie.split('; ').find(row => row.startsWith('role='));
    console.log("Current auth cookies:", { token, role });
    return { token, role };
  };