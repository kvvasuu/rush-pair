import useAppTheme from "@/hooks/useAppTheme";
import useFontSize from "@/hooks/useFontSize";
import { Colors } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

type Step = {
  key: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

interface Props {
  steps: Step[];
  activeStep: number;
  variant?: "numbers" | "icons";
  style?: ViewStyle;
}

export default function Stepper({ steps, activeStep, variant = "numbers", style }: Props) {
  const theme = useAppTheme();
  const { lg } = useFontSize();

  return (
    <View style={[styles.wrapper, style]}>
      {steps.map((step, index) => {
        const isActive = index === activeStep;
        const isCompleted = index < activeStep;
        const nextActive = index + 1 <= activeStep;

        return (
          <View style={{ gap: 8, flexDirection: "row", flex: index + 1 < steps.length ? 1 : undefined }} key={step.key}>
            <View
              style={[
                styles.step,
                {
                  borderColor: isActive || isCompleted ? Colors[theme].tint : Colors[theme].icon,
                  backgroundColor: isCompleted ? Colors[theme].tint : "transparent",
                },
              ]}
            >
              {variant === "icons" ? (
                <Ionicons
                  name={step.icon}
                  color={isActive ? Colors[theme].tint : isCompleted ? Colors[theme].backgroundAlt : Colors[theme].icon}
                  size={lg}
                />
              ) : (
                <Text
                  style={[
                    {
                      fontFamily: "MontserratSemiBold",
                      fontSize: lg,
                      lineHeight: lg + 4,
                      color: isActive
                        ? Colors[theme].tint
                        : isCompleted
                        ? Colors[theme].backgroundAlt
                        : Colors[theme].icon,
                    },
                  ]}
                >
                  {index + 1}
                </Text>
              )}
            </View>
            {index + 1 < steps.length && (
              <View style={{ alignItems: "stretch", justifyContent: "center", flex: 1 }}>
                <View
                  style={{
                    height: 2,
                    backgroundColor: nextActive ? Colors[theme].tint : Colors[theme].icon,
                  }}
                ></View>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 8,
  },
  step: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    borderWidth: 2,
  },
});
