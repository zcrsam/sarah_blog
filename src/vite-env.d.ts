/// <reference types="vite/client" />

declare module '*.jpg' {
  const jpgValue: string;
  export default jpgValue;
}

declare module '*.jpeg' {
  const jpegValue: string;
  export default jpegValue;
}

declare module '*.png' {
  const pngValue: string;
  export default pngValue;
}

declare module '*.JPG' {
  const JPGValue: string;
  export default JPGValue;
}

declare module '*.JPEG' {
  const JPEGValue: string;
  export default JPEGValue;
}

declare module '*.PNG' {
  const PNGValue: string;
  export default PNGValue;
}

declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  const svgSrc: string;
  export default svgSrc;
}
