import "./globals.css";

import clsx from "clsx";

import { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError
} from "@remix-run/react";
import { PreventFlashOnWrongTheme, Theme, ThemeProvider, useTheme } from "remix-themes";
import { TooltipProvider } from "./components/ui/tooltip";
import { themeSessionResolver } from "./sessions.server";
import localforage from "localforage";

export async function loader({ request }: LoaderFunctionArgs) {
  const { getTheme } = await themeSessionResolver(request);
  localforage.config({
    name: 'KodeRumahDB',
    storeName: 'themes',
  });
  return {
    theme: getTheme(),
  };
}



export const meta: MetaFunction<typeof loader> = ({
  data,
}) => {
  return [
    { name: "viewport", content: "width=device-width, initial-scale=1, shrink-to-fit=no" },
    { name: "description", content: "KodeRumah" },
    { name: "mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-capable", content: "yes" },
    { name: "application-name", content: "KodeRumah" },
    { name: "apple-mobile-web-app-title", content: "KodeRumah" },
    { name: "msapplication-navbutton-color", content: data?.theme == Theme.LIGHT ? "#fbfdf70a" : "#000000" },
    { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
    { name: "msapplication-starturl", content: "/" },
    // Add a manifest link to your `manifest.json`.
    { rel: "manifest", href: "/manifest.json" },

  ];
};

// Wrap your app with ThemeProvider.
// `specifiedTheme` is the stored theme in the session storage.
// `themeAction` is the action name that's used to change the theme in the session storage.
export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>();
  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
      <TooltipProvider>
        <App />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export function App() {
  const data = useLoaderData<typeof loader>();
  const [theme] = useTheme();
  return (
    <html lang="en" className={clsx(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content={data.theme === Theme.LIGHT ? "#fbfdf70a" : "#000000"} />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// export function ErrorBoundary() {
//   const error = useRouteError() as any;

//   if (isRouteErrorResponse(error)) {
//     return (
//       <>
//         <h1>
//           {error.status} {error.statusText}
//         </h1>
//         <p>{error.data}</p>
//       </>
//     );
//   }

//   return (
//     <>
//       <h1>Error!</h1>
//       <p>{JSON.stringify(error) ?? "Unknown error"}</p>
//     </>
//   );
// }