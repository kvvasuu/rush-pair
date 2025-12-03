import useAppTheme from "@/hooks/useAppTheme";
import useFontSize from "@/hooks/useFontSize";
import { Colors } from "@/utils/theme";
import { ReactNode, useEffect } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";

interface Props {
  isVisible: boolean;
  onModalClose: () => void;
  children: ReactNode;
  title?: string;
}
export default function BottomModal({
  isVisible,
  onModalClose,
  children,
  title,
}: Props) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();

  const bottom = useSharedValue(height * -0.8);

  const animatedStyle = useAnimatedStyle(() => ({
    bottom: bottom.value,
  }));

  useEffect(() => {
    if (isVisible) {
      bottom.value = withSpring(0, { damping: 30, stiffness: 180, mass: 1 });
    } else {
      bottom.value = height * -0.8;
    }
  }, [isVisible]);

  const drag = Gesture.Pan()
    .activeOffsetY([-50, 50])
    .shouldCancelWhenOutside(true)
    .onUpdate((event) => {
      const next = -event.translationY;
      bottom.value = Math.min(0, next);
    })
    .onEnd((event) => {
      const shouldClose = event.translationY > 200 || event.velocityY > 1000;

      if (shouldClose) {
        bottom.value = withSpring(height * -0.8, {
          damping: 30,
          stiffness: 180,
          mass: 1,
        });
        setTimeout(() => {
          scheduleOnRN(onModalClose);
        }, 300);
      } else {
        bottom.value = withSpring(0, { damping: 30, stiffness: 180, mass: 1 });
      }
    });

  if (!isVisible) return null;

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      onRequestClose={onModalClose}
      statusBarTranslucent
      supportedOrientations={["portrait", "landscape-left", "landscape-right"]}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onModalClose} />
        <GestureDetector gesture={drag}>
          <Animated.View
            style={[
              styles.modalContainer,
              animatedStyle,
              {
                backgroundColor: Colors[theme].background,
                paddingBottom: insets.bottom > 0 ? insets.bottom : 24,
              },
            ]}
          >
            <View
              style={[
                styles.dragHandleWrapper,
                {
                  borderColor: Colors[theme].border,
                  marginLeft: insets.left > 0 ? insets.left : 16,
                  marginRight: insets.right > 0 ? insets.right : 16,
                },
              ]}
            >
              <View
                style={[
                  styles.dragHandle,
                  {
                    backgroundColor: Colors[theme].border,
                  },
                ]}
              />
              {title && (
                <Text style={[styles.title, { color: Colors[theme].text }]}>
                  {title}
                </Text>
              )}
            </View>
            {children}
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    position: "relative",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    height: "80%",
    width: "100%",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 1, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    position: "absolute",
    left: 0,
    zIndex: 2,
    justifyContent: "space-between",
  },
  dragHandleWrapper: {
    alignItems: "center",
    gap: 16,
    borderBottomWidth: 0.5,
    paddingBottom: 16,
  },
  dragHandle: {
    width: 48,
    height: 4,
    borderRadius: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 600,
  },
});
