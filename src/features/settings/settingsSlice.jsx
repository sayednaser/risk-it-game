import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  gameType: "",
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    gameTypeSet: (state, action) => {
      console.assert(
        ["singlePlayer", "twoPlayer"].includes(action.payload),
        "Wrong Action Payload: gameTypeSet"
      );

      console.log(action);
      state.gameType = action.payload;
    },
  },
});

export const { gameTypeSet } = settingsSlice.actions;
export default settingsSlice.reducer;
