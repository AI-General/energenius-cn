import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  // A list of all locales that are supported
  locales: ["en-US", "zh"],

  // Used when no locale matches
  defaultLocale: "en-US",
});

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(zh|en-US)/:path*"],
};
