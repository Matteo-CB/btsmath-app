import type { GameMode } from "../lib/types";

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Flashcards: undefined;
  Leaderboard: undefined;
  Profile: undefined;
};

export type MainStackParamList = {
  Tabs: undefined;
  Game: { mode: GameMode };
};
