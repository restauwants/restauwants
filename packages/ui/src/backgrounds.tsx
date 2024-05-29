import * as React from "react";

import { cn } from ".";

const WavyBackground = React.forwardRef<
  SVGSVGElement,
  React.SVGProps<SVGSVGElement> & {
    variant: "blue-inner-pink-outer" | "pink-inner-blue-outer";
  }
>(({ className, variant, ...props }, ref) => {
  switch (variant) {
    case "blue-inner-pink-outer":
      return (
        <svg
          ref={ref}
          viewBox="0 0 4080 417"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn("h-full w-full", className)}
          {...props}
        >
          <path
            d="M-215.418 416.359C835.259 290.561 937.119 253.658 1433.04 322.673C1928.97 391.688 2093.07 298.64 2553.09 322.673C3013.11 346.706 2952.71 312.97 3116.29 248.736C3279.87 184.501 3523.68 277.799 3862.24 304.598C4200.8 331.398 4256.39 232.855 4256.39 232.855L4247.92 -16.9998L-86.6931 43.3793L-215.418 416.359Z"
            fill="#F16469"
          />
          <path
            d="M-90.6959 323C804.834 184.968 1180.15 173.731 1530.46 245.5C1880.77 317.269 1940.74 190.761 2380.05 211.256C2819.36 231.75 2992.49 249.064 3063.48 169.794C3134.48 90.5234 3450.44 117.988 3702.43 211.255C3954.42 304.523 4126.2 146.44 4126.2 146.44L4122.62 -48.9999L-22.0425 -17.7819L-90.6959 323Z"
            fill="#3D3A68"
          />
        </svg>
      );
    case "pink-inner-blue-outer":
      return (
        <svg
          ref={ref}
          viewBox="0 0 2586 430"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn("h-full w-full", className)}
          {...props}
        >
          <path
            d="M-22.4508 429.976C551.495 291.944 792.035 280.708 1016.55 352.477C1241.06 424.246 1279.5 297.738 1561.05 318.232C1842.6 338.726 1953.56 356.04 1999.06 276.77C2044.56 197.5 2247.07 224.964 2408.56 318.232C2570.06 411.5 2680.16 253.416 2680.16 253.416L2677.86 57.9766L21.5492 89.1947L-22.4508 429.976Z"
            fill="#3D3A68"
          />
          <path
            d="M-107.936 369.359C565.443 243.561 630.725 206.658 948.564 275.673C1266.4 344.688 1371.58 251.64 1666.4 275.673C1961.23 299.706 1922.52 265.97 2027.36 201.736C2132.19 137.501 2288.46 230.799 2505.44 257.598C2722.42 284.398 2758.05 185.855 2758.05 185.855L2752.62 -63.9998L-25.4364 -3.62068L-107.936 369.359Z"
            fill="#F16469"
          />
        </svg>
      );
  }
});
WavyBackground.displayName = "WavyBackground";

export { WavyBackground };
