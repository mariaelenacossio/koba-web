export type Theme = "dark" | "light";

/** localStorage key for the visitor's explicit choice. */
export const THEME_STORAGE_KEY = "koba-theme";

/**
 * Runs in <head> before first paint. Dark is the default for every first
 * visit, whatever the system setting; only a saved choice switches to light.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
