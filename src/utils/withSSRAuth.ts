import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "../errors/AuthTokenError";
import decode from "jwt-decode";
import { validateUserPermissions } from "./validateUserPermissions";

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
      const token = cookies["ienvironment.token"];

      console.log("SSRAuth")
      console.log(cookies)
      console.log(token)

      if (!token) {
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }

      console.log("2")
      console.log(options)

      if (options) {
        const user = decode<{ roles: string[] }>(token);
        const { role } = options;

        const userHasValidPermissions = validateUserPermissions({
          user,
          role,
        });

        if (!userHasValidPermissions) {
          return {
            redirect: {
              destination: "/dashboard",
              permanent: false,
            },
          };
        }
      }
    } catch (error) {
      console.log("3")
      console.log(error)
    }

    try {
      return await fn(ctx);
    } catch (error) {
      console.log("4")
      console.log(error)
      if (error instanceof AuthTokenError) {
        console.log("Destroy cookie")
        destroyCookie(ctx, "ienvironment.token");
        destroyCookie(ctx, "ienvironment.refreshToken");

        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }
    }
  };
}
