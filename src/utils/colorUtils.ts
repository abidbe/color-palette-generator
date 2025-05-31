import { colord } from "colord";

export interface Color {
  hex: string;
  rgb: string;
  hsl: string;
  name: string;
  brightness: number;
}

// Generate random color
export const generateRandomColor = (): Color => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 40) + 60; // 60-100%
  const lightness = Math.floor(Math.random() * 50) + 25; // 25-75%

  const color = colord({ h: hue, s: saturation, l: lightness });

  return {
    hex: color.toHex(),
    rgb: color.toRgbString(),
    hsl: color.toHslString(),
    name: getColorName(color.toHex()),
    brightness: getBrightness(color.toHex()),
  };
};

// Generate harmonious palette
export const generateHarmoniousPalette = (count: number = 5): Color[] => {
  const baseHue = Math.floor(Math.random() * 360);
  const colors: Color[] = [];
  const harmonyTypes = [
    "monochromatic",
    "analogous",
    "complementary",
    "triadic",
    "tetradic",
  ];
  const harmonyType =
    harmonyTypes[Math.floor(Math.random() * harmonyTypes.length)];

  for (let i = 0; i < count; i++) {
    let hue = baseHue;
    let saturation = 70 + Math.floor(Math.random() * 20); // 70-90%
    let lightness = 30 + i * 15; // Varying lightness

    switch (harmonyType) {
      case "monochromatic":
        // Same hue, different saturation and lightness
        saturation = 60 + i * 8;
        lightness = 25 + i * 15;
        break;
      case "analogous":
        hue = (baseHue + i * 30) % 360;
        break;
      case "complementary":
        hue = i % 2 === 0 ? baseHue : (baseHue + 180) % 360;
        break;
      case "triadic":
        hue = (baseHue + i * 120) % 360;
        break;
      case "tetradic":
        hue = (baseHue + i * 90) % 360;
        break;
      default:
        hue = (baseHue + i * 60) % 360;
    }

    // Ensure lightness stays within reasonable bounds
    lightness = Math.min(Math.max(lightness, 20), 80);
    saturation = Math.min(Math.max(saturation, 50), 95);

    const color = colord({ h: hue, s: saturation, l: lightness });

    colors.push({
      hex: color.toHex(),
      rgb: color.toRgbString(),
      hsl: color.toHslString(),
      name: getColorName(color.toHex()),
      brightness: getBrightness(color.toHex()),
    });
  }

  return colors;
};

// Get color brightness
export const getBrightness = (hex: string): number => {
  const color = colord(hex);
  const { r, g, b } = color.toRgb();
  // Calculate relative luminance
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};

// Generate color name
export const getColorName = (hex: string): string => {
  const color = colord(hex);
  const { h, s, l } = color.toHsl();

  // Simple color naming based on hue
  if (s < 10) return l > 90 ? "White" : l < 10 ? "Black" : "Gray";

  if (h < 15 || h >= 345) return "Red";
  if (h < 45) return "Orange";
  if (h < 75) return "Yellow";
  if (h < 105) return "Yellow Green";
  if (h < 135) return "Green";
  if (h < 165) return "Blue Green";
  if (h < 195) return "Cyan";
  if (h < 225) return "Blue";
  if (h < 255) return "Blue Violet";
  if (h < 285) return "Violet";
  if (h < 315) return "Purple";
  return "Pink";
};

// Copy to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    return true;
  }
};

// Export palette formats
export const exportPalette = (palette: Color[], format: string): string => {
  switch (format) {
    case "css":
      return palette
        .map((color, i) => `--color-${i + 1}: ${color.hex};`)
        .join("\n");
    case "scss":
      return palette
        .map((color, i) => `$color-${i + 1}: ${color.hex};`)
        .join("\n");
    case "json":
      return JSON.stringify(
        palette.map((c) => ({ hex: c.hex, rgb: c.rgb, hsl: c.hsl })),
        null,
        2
      );
    default:
      return palette.map((c) => c.hex).join(", ");
  }
};
