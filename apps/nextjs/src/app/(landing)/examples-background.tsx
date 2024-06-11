import { PropsWithChildren } from "react";

import { WavyBackground } from "@restauwants/ui/backgrounds";

export const ExamplesBackground = ({ children }: PropsWithChildren) => {
  return (
    <div className="relative pb-[300px] pt-[500px]">
      <WavyBackground
        variant={0}
        className="absolute top-[180px] -z-50 h-[200px] w-full rotate-180"
      />
      <div className="absolute top-0 -z-40 h-full w-full pb-[199px] pt-[379px]">
        <div className="h-full w-full bg-secondary" />
      </div>
      <WavyBackground
        variant={3}
        className="absolute bottom-0 -z-50 h-[200px] w-full"
      />
      {children}
    </div>
  );
};
