"use client";

import { useMediaQuery } from "usehooks-ts";

export const useIsDesktop = () => useMediaQuery("(min-width: 768px)");
