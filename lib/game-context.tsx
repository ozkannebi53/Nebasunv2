import React, { createContext, useContext, useEffect, useReducer } from "react";
import { loadPlayer, savePlayer, addXP, addGold, incrementCombo, resetCombo, type PlayerState } from "./game-store";
import { TURKEY_CITIES, WORLD_CITIES, SCORPIONS, INITIAL_QUESTS, INITIAL_ACHIEVEMENTS } from "./game-store";

type Action =
  | { type: "LOAD"; payload: PlayerState }
  | { type: "ADD_XP"; amount: number }
  | { type: "ADD_GOLD"; amount: number }
  | { type: "ADD_GEMS"; amount: number }
  | { type: "COMBO_INC" }
  | { type: "COMBO_RESET" }
  | { type: "SET_ENERGY"; energy: number }
  | { type: "SET_NAME"; name: string }
  | { type: "UNLOCK_SCORPION"; id: string }
  | { type: "SET_ACTIVE_SCORPION"; id: string }
  | { type: "COMPLETE_CITY"; cityId: string; stars: number }
  | { type: "QUEST_PROGRESS"; questId: string; amount: number }
  | { type: "UNLOCK_ACHIEVEMENT"; achievementId: string };

function reducer(state: PlayerState, action: Action): PlayerState {
  switch (action.type) {
    case "LOAD": return action.payload;
    case "ADD_XP": return addXP(state, action.amount);
    case "ADD_GOLD": return addGold(state, action.amount);
    case "ADD_GEMS": return { ...state, gems: state.gems + action.amount };
    case "COMBO_INC": return incrementCombo(state);
    case "COMBO_RESET": return resetCombo(state);
    case "SET_ENERGY": return { ...state, energy: action.energy };
    case "SET_NAME": return { ...state, name: action.name };
    case "UNLOCK_SCORPION":
      return {
        ...state,
        scorpions: state.scorpions.map(s => s.id === action.id ? { ...s, unlocked: true } : s),
      };
    case "SET_ACTIVE_SCORPION":
      return { ...state, activeScorpion: action.id };
    case "COMPLETE_CITY":
      return {
        ...state,
        cities: state.cities.map(c =>
          c.id === action.cityId ? { ...c, completed: true, stars: action.stars } : c
        ),
        totalWordsFound: state.totalWordsFound + 10,
      };
    case "QUEST_PROGRESS":
      return {
        ...state,
        quests: state.quests.map(q => {
          if (q.id !== action.questId || q.completed) return q;
          const progress = Math.min(q.progress + action.amount, q.target);
          return { ...q, progress, completed: progress >= q.target };
        }),
      };
    case "UNLOCK_ACHIEVEMENT":
      return {
        ...state,
        achievements: state.achievements.map(a =>
          a.id === action.achievementId ? { ...a, unlocked: true } : a
        ),
      };
    default: return state;
  }
}

const defaultState: PlayerState = {
  name: "Akrep Savaşçısı",
  level: 1, xp: 0, xpToNext: 1000,
  gold: 500, gems: 50,
  energy: 50, maxEnergy: 50,
  league: "Bronz", leaguePoints: 0,
  currentCity: "istanbul", currentCityIndex: 0,
  totalWordsFound: 0, streak: 0, lastPlayDate: "",
  activeScorpion: "golden",
  scorpions: SCORPIONS,
  cities: [...TURKEY_CITIES, ...WORLD_CITIES],
  quests: INITIAL_QUESTS,
  achievements: INITIAL_ACHIEVEMENTS,
  combo: 0, maxCombo: 0,
};

interface GameContextValue {
  state: PlayerState;
  dispatch: React.Dispatch<Action>;
}

const GameContext = createContext<GameContextValue>({ state: defaultState, dispatch: () => {} });

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, defaultState);

  useEffect(() => {
    loadPlayer().then(p => dispatch({ type: "LOAD", payload: p }));
  }, []);

  useEffect(() => {
    savePlayer(state);
  }, [state]);

  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
}

export function useGame() {
  return useContext(GameContext);
}
