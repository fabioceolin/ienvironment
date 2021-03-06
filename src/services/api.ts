import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies';
import { signOut } from 'contexts/AuthContext';
import { AuthTokenError } from 'errors/AuthTokenError';

let isRefreshing = false;
let failedRequestQueue = [];

export function setupAPIClient(ctx = undefined) {
  let cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      Authorization: `Bearer ${cookies['ienvironment.token']}`,
    },
  });

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      console.log('erro api', error);
      if (error.response?.status === 401) {
        if (error.response.headers['token-expired'] === 'true') {
          cookies = parseCookies(ctx);

          const { 'ienvironment.refreshToken': oldRefreshToken } = cookies;
          const originalConfig = error.config;

          if (!isRefreshing) {
            isRefreshing = true;

            api
              .post('user/refresh', {
                refreshToken: oldRefreshToken,
              })
              .then((response) => {
                const { token, refreshToken } = response.data;

                setCookie(ctx, 'ienvironment.token', token, {
                  maxAge: 60 * 60 * 24 * 30, // 30 days
                  path: '/',
                });

                setCookie(ctx, 'ienvironment.refreshToken', refreshToken, {
                  maxAge: 60 * 60 * 24 * 30, // 30 days
                  path: '/',
                });

                api.defaults.headers['Authorization'] = `Bearer ${token}`;

                failedRequestQueue.forEach((request) => {
                  request.onSuccess(token);
                });
                failedRequestQueue = [];
              })
              .catch((err) => {
                failedRequestQueue.forEach((request) => {
                  request.onFailure(err);
                });
                failedRequestQueue = [];

                if (process.browser) {
                  signOut();
                }
              })
              .finally(() => {
                isRefreshing = false;
              });
          }

          return new Promise((resolve, reject) => {
            failedRequestQueue.push({
              onSuccess: (token: string) => {
                originalConfig.headers['Authorization'] = `Bearer ${token}`;

                resolve(api(originalConfig));
              },
              onFailure: (err: AxiosError) => {
                reject(err);
              },
            });
          });
        } else {
          if (process.browser) {
            signOut();
          } else {
            return Promise.reject(new AuthTokenError());
          }
        }
      }
      return Promise.reject(error);
    }
  );

  return api;
}
