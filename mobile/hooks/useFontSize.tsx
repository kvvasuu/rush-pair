import { useWindowDimensions } from "react-native";

export default function useFontSize() {
  const { width, height } = useWindowDimensions();

  const xxs = width >= 800 && height >= 400 ? 10 : 8;
  const xs = width >= 800 && height >= 400 ? 12 : 10;
  const sm = width >= 800 && height >= 400 ? 14 : 12;
  const base = width >= 800 && height >= 400 ? 16 : 14;
  const lg = width >= 800 && height >= 400 ? 18 : 16;
  const xl = width >= 800 && height >= 400 ? 24 : 20;
  const xxl = width >= 800 && height >= 400 ? 28 : 24;
  const xxxl = width >= 800 && height >= 400 ? 32 : 28;
  const xxxxl = width >= 800 && height >= 400 ? 36 : 32;

  return { xs, sm, base, lg, xl, xxl, xxxl, xxxxl };
}
