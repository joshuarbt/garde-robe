"use client";

import { BarbieSparkles } from "@/components/theme/BarbieSparkles";
import { GhibliClouds } from "@/components/theme/GhibliClouds";
import { MatrixRain } from "@/components/theme/MatrixRain";
import { useTheme } from "@/components/theme/ThemeProvider";
import { VaporwaveScene } from "@/components/theme/VaporwaveScene";

export function ThemeEffects() {
  const { theme } = useTheme();

  switch (theme) {
    case "matrix":
      return <MatrixRain />;
    case "barbie":
      return <BarbieSparkles />;
    case "ghibli":
      return <GhibliClouds />;
    case "vaporwave":
      return <VaporwaveScene />;
    default:
      return null;
  }
}
