const RAW: string = process.env.NEXT_PUBLIC_SITE_URL || "hargile.com";

export const SITE_HOSTNAME: string = RAW.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
export const SITE_URL: string = `https://${SITE_HOSTNAME}`;
