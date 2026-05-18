const RAW: string = process.env.NEXT_PUBLIC_SITE_URL || "hargile.be";

export const SITE_HOSTNAME: string = RAW.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
export const SITE_URL: string = `https://${SITE_HOSTNAME}`;
