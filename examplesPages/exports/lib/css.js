// Tiny CSS-string -> React style object helper, memoized.
// Lets the JSX keep the exact declarations from the design source.
// ~20 lines; replace with CSS Modules later if you prefer.
const cache = new Map();

export function css(text) {
  const hit = cache.get(text);
  if (hit) return hit;
  const out = {};
  text.split(';').forEach((decl) => {
    const i = decl.indexOf(':');
    if (i < 0) return;
    const prop = decl.slice(0, i).trim();
    const value = decl.slice(i + 1).trim();
    if (!prop || !value) return;
    const key = prop.startsWith('--')
      ? prop
      : prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    out[key] = value;
  });
  cache.set(text, out);
  return out;
}
