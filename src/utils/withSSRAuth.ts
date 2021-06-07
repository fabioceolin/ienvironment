import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';
import { destroyCookie, parseCookies } from 'nookies';
import { AuthTokenError } from 'errors/AuthTokenError';
import decode from 'jwt-decode';
import { validateUserPermissions } from './validateUserPermissions';

type WithSSRAuthProps = {
  role?: string;
};

export function withSSRAuth<P>(
  fn: GetServerSideProps<P>,
  options?: WithSSRAuthProps
) {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    try {
      const cookies = parseCookies(ctx);
      const token = cookies['ienvironment.token'];

      if (!token) {
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        };
      }

      if (options) {
        const user = decode<{ role: string }>(token);
        const { role } = options;

        const userHasValidPermissions = validateUserPermissions({
          user,
          role,
        });

        if (!userHasValidPermissions) {
          return {
            redirect: {
              destination: '/dashboard',
              permanent: false,
            },
          };
        }
      }
    } catch (error) {
      console.log('withSSRAuth: ', error);
    }

    try {
      return await fn(ctx);
    } catch (error) {
      console.log('withSSRAuth: Forced logout', error);
      if (error instanceof AuthTokenError) {
        console.log('Destroy cookie');
        destroyCookie(ctx, 'ienvironment.token');
        destroyCookie(ctx, 'ienvironment.refreshToken');

        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        };
      }
    }
  };
}
