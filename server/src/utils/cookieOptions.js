export const getCookieOptions = () => {
  // If COOKIE_SECURE is explicitly "true", set secure to true (requires HTTPS).
  // Default to false so plain HTTP deployments (e.g., http://16.16.209.242) don't have cookies rejected by modern browsers.
  const isHttps = process.env.COOKIE_SECURE === "true";

  return {
    httpOnly: true,
    secure: isHttps,
    sameSite: isHttps ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  };
};
