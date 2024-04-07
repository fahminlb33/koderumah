import { Theme, createThemeAction } from "remix-themes";

import { themeSessionResolver } from "../sessions.server";
import { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";

export async function loader({ request }: LoaderFunctionArgs) {
    const { getTheme } = await themeSessionResolver(request);
    return {
        theme: getTheme(),
    };
}

export const meta: MetaFunction<typeof loader> = ({
    data,
}) => {
    return [
        { name: "theme-color", content: data?.theme == Theme.LIGHT ? "#fbfdf70a" : "#000000" },
    ];
};

export const action = createThemeAction(themeSessionResolver);
