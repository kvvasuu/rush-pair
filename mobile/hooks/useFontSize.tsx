import { useWindowDimensions } from "react-native";

export default function useFontSize() {
  const { width, height } = useWindowDimensions();

  const sm = width >= 800 && height >= 400 ? 14 : 10;
  const base = width >= 800 && height >= 400 ? 16 : 12;
  const lg = width >= 800 && height >= 400 ? 18 : 14;
  const xl = width >= 800 && height >= 400 ? 24 : 16;
  const xxl = width >= 800 && height >= 400 ? 26 : 20;

  return { sm, base, lg, xl, xxl };
}
