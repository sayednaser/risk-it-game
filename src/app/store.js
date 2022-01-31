import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "../features/settings/settingsSlice";
import gameReducer from "../features/game/gameSlice";

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    game: gameReducer,
  },
});
