import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform, View, Text, StyleSheet } from "react-native";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";

const TABS = [
  { name: "index",    title: "Macera",   icon: "map.fill"           as const },
  { name: "pvp",      title: "PvP",      icon: "bolt.fill"          as const },
  { name: "guild",    title: "Lonca",    icon: "shield.fill"        as const },
  { name: "quests",   title: "Görevler", icon: "list.bullet"        as const },
  { name: "profile",  title: "Profil",   icon: "person.fill"        as const },
];

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 60 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#5A2EFF",
        tabBarInactiveTintColor: "#8899BB",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: "#0A1540",
          borderTopColor: "#1E2F6E",
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          marginTop: 2,
        },
      }}
    >
      {TABS.map(tab => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color }) => <IconSymbol size={24} name={tab.icon} color={color} />,
          }}
        />
      ))}
    </Tabs>
  );
}
