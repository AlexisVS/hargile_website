const RAW = process.env.NEXT_PUBLIC_SITE_URL || 'hargile.be';

export const SITE_HOSTNAME = RAW.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
export const SITE_URL = `https://${SITE_HOSTNAME}`;
