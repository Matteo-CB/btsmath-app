import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import GameScreen from "./src/screens/GameScreen";
import LeaderboardScreen from "./src/screens/LeaderboardScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import FlashcardsScreen from "./src/screens/FlashcardsScreen";
import CoursesScreen from "./src/screens/CoursesScreen";
import { getCurrentUser } from "./src/lib/auth";
import { colors } from "./src/components/theme";
import type { GameMode } from "./src/lib/types";

// Navigation types
export type RootStackParamList = {
  MainTabs: undefined;
  Game: { mode: GameMode };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Courses: undefined;
  Flashcards: undefined;
  Leaderboard: undefined;
  Profile: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

// Auth Navigator
function AuthNavigator({ onLogin }: { onLogin: () => void }) {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login">
        {(props) => (
          <LoginScreen
            {...props}
            onLogin={onLogin}
            onNavigateToRegister={() => props.navigation.navigate("Register")}
          />
        )}
      </AuthStack.Screen>
      <AuthStack.Screen name="Register">
        {(props) => (
          <RegisterScreen
            {...props}
            onRegister={onLogin}
            onNavigateToLogin={() => props.navigation.navigate("Login")}
          />
        )}
      </AuthStack.Screen>
    </AuthStack.Navigator>
  );
}

// Main Tab Navigator
function MainTabNavigator({
  onLogout,
  onStartGame,
}: {
  onLogout: () => void;
  onStartGame: (mode: GameMode) => void;
}) {
  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600" as const,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case "Dashboard":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Courses":
              iconName = focused ? "book" : "book-outline";
              break;
            case "Flashcards":
              iconName = focused ? "albums" : "albums-outline";
              break;
            case "Leaderboard":
              iconName = focused ? "trophy" : "trophy-outline";
              break;
            case "Profile":
              iconName = focused ? "person" : "person-outline";
              break;
            default:
              iconName = "help-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <MainTab.Screen name="Dashboard" options={{ tabBarLabel: "Accueil" }}>
        {() => <DashboardScreen onLogout={onLogout} onStartGame={onStartGame} />}
      </MainTab.Screen>
      <MainTab.Screen
        name="Courses"
        component={CoursesScreen}
        options={{ tabBarLabel: "Cours" }}
      />
      <MainTab.Screen
        name="Flashcards"
        component={FlashcardsScreen}
        options={{ tabBarLabel: "Flashcards" }}
      />
      <MainTab.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{ tabBarLabel: "Classement" }}
      />
      <MainTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: "Profil" }}
      />
    </MainTab.Navigator>
  );
}

// Main Navigator (Tabs + Game)
function MainNavigator({ onLogout }: { onLogout: () => void }) {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="MainTabs">
        {({ navigation }) => (
          <MainTabNavigator
            onLogout={onLogout}
            onStartGame={(mode: GameMode) => navigation.navigate("Game", { mode })}
          />
        )}
      </RootStack.Screen>
      <RootStack.Screen name="Game" options={{ animation: "slide_from_right" }}>
        {({ route, navigation }) => (
          <GameScreen mode={route.params.mode} onExit={() => navigation.goBack()} />
        )}
      </RootStack.Screen>
    </RootStack.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const user = await getCurrentUser();
      setIsAuthenticated(!!user);
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Loading state
  if (isAuthenticated === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      {isAuthenticated ? (
        <MainNavigator onLogout={handleLogout} />
      ) : (
        <AuthNavigator onLogin={handleLogin} />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
});
