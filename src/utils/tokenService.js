// tokenService.js

export const setTokens = (accessToken, refreshToken) => {
  console.log(accessToken, refreshToken);

  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);

  console.log('Tokens saved');
};

export const getAccessToken = () => localStorage.getItem('accessToken');

export const getRefreshToken = () => localStorage.getItem('refreshToken');

export const removeTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};
