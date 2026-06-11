import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

const MAPPING = {
  // Navigation
  "house.fill":                             "home",
  "map.fill":                               "map",
  "person.fill":                            "person",
  "trophy.fill":                            "emoji-events",
  "bag.fill":                               "shopping-bag",
  "list.bullet":                            "list",
  "gamecontroller.fill":                    "sports-esports",
  "person.2.fill":                          "group",
  "shield.fill":                            "shield",
  "star.fill":                              "star",
  "bolt.fill":                              "bolt",
  "heart.fill":                             "favorite",
  "flame.fill":                             "local-fire-department",
  "crown.fill":                             "workspace-premium",
  "gift.fill":                              "card-giftcard",
  "chart.bar.fill":                         "bar-chart",
  "magnifyingglass":                        "search",
  "bell.fill":                              "notifications",
  "gearshape.fill":                         "settings",
  "arrow.left":                             "arrow-back",
  "arrow.right":                            "arrow-forward",
  "xmark":                                  "close",
  "checkmark":                              "check",
  "lock.fill":                              "lock",
  "lock.open.fill":                         "lock-open",
  "info.circle.fill":                       "info",
  "questionmark.circle.fill":               "help",
  "paperplane.fill":                        "send",
  "chevron.left.forwardslash.chevron.right":"code",
  "chevron.right":                          "chevron-right",
  "chevron.left":                           "chevron-left",
  "chevron.up":                             "expand-less",
  "chevron.down":                           "expand-more",
  "plus":                                   "add",
  "minus":                                  "remove",
  "sparkles":                               "auto-awesome",
  "wand.and.stars":                         "auto-fix-high",
  "globe":                                  "public",
  "clock.fill":                             "schedule",
  "calendar":                               "calendar-today",
  "sword":                                  "sports-martial-arts",
  "swords":                                 "sports-martial-arts",
} as unknown as IconMapping;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
