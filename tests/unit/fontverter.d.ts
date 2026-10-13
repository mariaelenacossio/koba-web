declare module "fontverter" {
  const fontverter: {
    convert(font: Uint8Array, format: "sfnt" | "woff" | "woff2"): Promise<Uint8Array>;
  };
  export default fontverter;
}
