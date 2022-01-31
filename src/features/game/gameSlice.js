import _ from "lodash";
import { createSlice } from "@reduxjs/toolkit";
import {
  ATTACK_PHASE,
  DRAFT_PHASE,
  GENERATOR,
  getAttackFromChoices,
  getAttackToChoices,
  getFortifyFromChoices,
  getFortifyToChoices,
  getLosses,
  getNextPhase,
  getOwnTerritories,
  getTerritories,
  hasNoOwner,
  INIT_ATTACK_PHASE_STATE,
  INIT_DRAFT_PHASE_STATE,
  INIT_FORTIFY_PHASE_STATE,
  INIT_POST_START_PHASE_STATE,
  INIT_START_PHASE_STATE,
  isDraftFinish,
  isInStartPhase,
  isOwner,
  MAP_TABLE,
  NOT_SELECTED,
  NO_DICE,
  PLAYERS_IDS,
  PLAYERS_INIT_STATE,
  POST_START_PHASE,
  START_PHASE,
  togglePlayer,
  turnStartedUtil,
} from "./gamelogic";


const initialState = {
  players: PLAYERS_INIT_STATE,
  initial: INIT_START_PHASE_STATE,
  turnCount: 0,
  turn: {
    player: PLAYERS_IDS[0], // to start with 1
    currentPhase: START_PHASE,
    draft: INIT_DRAFT_PHASE_STATE,
    attack: INIT_ATTACK_PHASE_STATE,
    fortify: INIT_FORTIFY_PHASE_STATE,
  },
  map: MAP_TABLE,
};

const sliceConfig = {
  name: "game",
  initialState,
  reducers: {
    deploySelectedInitial: (state, action) => {
      console.assert(
        state.turn.currentPhase === START_PHASE,
        "Deploy in wrong phase",
        state.turn.currentPhase
      );

      const territory = action.payload;

      /* Player selected taken territory */
      if (hasNoOwner(state, territory)) {
        return;
      }

      /* Player now owns this territory */
      state.map.entities[territory].owner = state.turn.player;
      state.map.entities[territory].troopsCount = 1;

      // state.players.entities[state.turn.player].territoriesCount += 1;
      // state.players.entities[state.turn.player].troopsCount += 1;

      state.initial.initialTroops -= 1;

      state.turn.player = togglePlayer(state);

      /* If all territories now have an owner,
       * every player deploy the rest */
      if (state.initial.initialTroops === 0) {
        state.turn.currentPhase = POST_START_PHASE;
        state.turn.draft = INIT_POST_START_PHASE_STATE;
      }
    },
    deploySelected: (state, action) => {
      console.assert(
        state.turn.currentPhase === DRAFT_PHASE ||
          state.turn.currentPhase === POST_START_PHASE,
        "Deploy in wrong phase",
        state.turn.currentPhase
      );
      const territory = action.payload;
      // const owner = state.map.entities[territory].owner;

      /* if selected territory is valid */
      if (isOwner(state, territory)) {
        state.map.entities[territory].troopsCount += 1;
        // state.players.entities[state.turn.player].troopsCount += 1;
        state.turn.draft.reinforcements -= 1;

        /* If the  player finished deploying in the start phase, */
        if (isDraftFinish(state) && isInStartPhase(state)) {
          /* Move to the next player, if there is */
          if (state.turn.player === PLAYERS_IDS[0]) {
            state.turn.player = togglePlayer(state);
            state.turn.draft = INIT_POST_START_PHASE_STATE;

            /* or start the game */
          } else {
            turnStartedUtil(state, action);
          }
          return;
        }

        /* Automatically, move to the attack phase,
         * if all the reinforcements are deployed */
        if (state.turn.draft.reinforcements === 0) {
          state.turn.currentPhase = ATTACK_PHASE;
        }
      }
    },
    turnStarted: turnStartedUtil,
    attackSelected: (state, action) => {
      console.assert(
        state.turn.currentPhase === ATTACK_PHASE,
        "Deploy in wrong phase",
        state.turn.currentPhase
      );
      const territory = action.payload;
      const attackFrom = state.turn.attack.attackFrom;
      const attackTo = state.turn.attack.attackTo;

      /* This fixes if selection happens after successful attack before finish deploying */
      if (
        attackFrom &&
        attackTo &&
        state.map.entities[attackFrom].owner ===
          state.map.entities[attackTo].owner
      ) {
        return;
      }

      const attackFromChoices = getAttackFromChoices(state);

      /* If no territory selected to attack from, try to select it */
      if (!attackFrom && attackFromChoices.includes(territory)) {
        state.turn.attack.attackFrom = territory;

        /* If attackFrom is selected, and I am selecting it again */
      } else if (attackFrom && territory === attackFrom) {
        state.turn.attack = INIT_ATTACK_PHASE_STATE;

        /* If attackFrom is selected, and i am selecting another valid territory */
      } else if (attackFrom && attackFromChoices.includes(territory)) {
        state.turn.attack = INIT_ATTACK_PHASE_STATE;
        state.turn.attack.attackFrom = territory;

        /* If attackFrom is selected, and i am selecting valid territory to attack */
      } else if (
        attackFrom &&
        getAttackToChoices(state, attackFrom).includes(territory)
      ) {
        if (attackTo === territory) {
          state.turn.attack.attackTo = NOT_SELECTED;
        } else {
          state.turn.attack.attackTo = territory;
        }
      }
    },
    diceRolled: {
      reducer: (state, action) => {
        state.turn.attack.attackDice = action.payload.attackDice;
        state.turn.attack.defenseDice = action.payload.defenseDice;
      },
      prepare: (attackDiceCount, defenseDiceCount) => {
        const attackDice = GENERATOR.uniformIntArray(1, 7, attackDiceCount);
        const defenseDice = GENERATOR.uniformIntArray(1, 7, defenseDiceCount);

        return {
          payload: {
            attackDice,
            defenseDice,
          },
        };
      },
    },
    attackPerformed: (state, action) => {
      const { attackLoss, defenseLoss } = getLosses(state);

      const attackTerritory = state.map.entities[state.turn.attack.attackFrom];
      const defenseTerritory = state.map.entities[state.turn.attack.attackTo];

      attackTerritory.troopsCount -= attackLoss;
      defenseTerritory.troopsCount -= defenseLoss;

      // state.players.entities[state.turn.player].troopsCount -= attackLoss;

      // state.players.entities[defenseTerritory.owner].troopsCount -= defenseLoss;

      /* If all the defenses defeated, take the territory */
      if (defenseTerritory.troopsCount === 0) {
        defenseTerritory.owner = state.turn.player;
        // defenseTerritory.troopsCount += state.turn.attack.attackDice.length;
        // attackTerritory.troopsCount -= state.turn.attack.attackDice.length;
        defenseTerritory.troopsCount += defenseLoss;
        attackTerritory.troopsCount -= defenseLoss;
      }

      /* If attacking territory reached 1 troop, de-select it */
      if (attackTerritory.troopsCount === 1) {
        state.turn.attack = INIT_ATTACK_PHASE_STATE;
      }
    },

    attackCompleted: (state, action) => {
      const troopsToMove = action.payload;
      const attackTerritory = state.map.entities[state.turn.attack.attackFrom];
      const defenseTerriotry = state.map.entities[state.turn.attack.attackTo];

      attackTerritory.troopsCount -= troopsToMove;
      defenseTerriotry.troopsCount += troopsToMove;

      state.turn.attack = INIT_ATTACK_PHASE_STATE;
    },
    nextPhase: (state, action) => {
      state.turn.currentPhase = getNextPhase(state);
    },
    fortifySelected: (state, action) => {
      console.assert(
        state.turn.currentPhase === "fortify",
        "Deploy in wrong phase",
        state.turn.currentPhase
      );
      const player = state.turn.player;
      const territory = action.payload;
      const owner = state.map.entities[territory].owner;

      const fortifyFrom = state.turn.fortify.fortifyFrom;
      const fortifyTo = state.turn.fortify.fortifyTo;

      const fortifyFromChoices = getFortifyFromChoices(state);

      /* If fortifyFrom not selected, try to select it */
      if (!fortifyFrom && fortifyFromChoices.includes(territory)) {
        state.turn.fortify.fortifyFrom = territory;

        /* If fortifyFrom is selected, and I am selecting it again */
      } else if (fortifyFrom && territory === fortifyFrom) {
        state.turn.fortify = INIT_FORTIFY_PHASE_STATE;

        /* If fortifyFrom is selected, try to select fortifyTo */
      } else if (
        fortifyFrom &&
        getFortifyToChoices(state, fortifyFrom).includes(territory)
      ) {
        if (territory === fortifyTo) {
          state.turn.attack.fortifyTo = NOT_SELECTED;
        } else {
          state.turn.fortify.fortifyTo = territory;
        }
      }
    },
    fortifyPerformed: (state, action) => {
      const fortifyCount = action.payload;

      state.map.entities[state.turn.fortify.fortifyFrom].troopsCount -=
        fortifyCount;
      state.map.entities[state.turn.fortify.fortifyTo].troopsCount +=
        fortifyCount;

      state.turn.fortify = INIT_FORTIFY_PHASE_STATE;
    },
  },
};

export const gameSlice = createSlice(sliceConfig);

export const {
  deploySelectedInitial,
  deploySelected,
  turnStarted,
  attackSelected,
  diceRolled,
  attackPerformed,
  attackCompleted,
  nextPhase,
  fortifySelected,
  fortifyPerformed,
} = gameSlice.actions;

export default gameSlice.reducer;

// Selectors
export const selectAttackPossible = (state) => {
  const { attackFrom, attackTo } = state.game.turn.attack;

  return Boolean(attackFrom && attackTo);
};

export const selectCurrentPhase = (state) => {
  return state.game.turn.currentPhase;
};

export const selectDice = (state) => {
  return {
    attackDice: state.game.turn.attack.attackDice,
    defenseDice: state.game.turn.attack.defenseDice,
  };
};

export const selectDiceLimit = (state) => {
  const map = state.game.map.entities;
  const attackTroopsCount =
    map[state.game.turn.attack.attackFrom]?.troopsCount || 0;
  const defenseTroopsCount =
    map[state.game.turn.attack.attackTo]?.troopsCount || 0;

  return {
    attackDiceLimit: Math.min(3, attackTroopsCount - 1),
    defenseDiceLimit: Math.min(2, defenseTroopsCount),
  };
};
export const selectMoveTroopsLimit = (state) => {
  const map = state.game.map.entities;
  const attackTroopsCount =
    map[state.game.turn.attack.attackFrom]?.troopsCount || 1;

  return attackTroopsCount - 1;
};
export const selectfortifyLimit = (state) => {
  const map = state.game.map.entities;
  const fortifyFromCount =
    map[state.game.turn.fortify.fortifyFrom]?.troopsCount;

  return fortifyFromCount - 1 || 0;
};

export const selectisFirstAttack = (state) => {
  return _.isEqual(state.game.turn.attack.attackDice, NO_DICE);
};

export const selectisLastAttack = (state) => {
  return isOwner(state.game, state.game.turn.attack.attackTo)
};

export const selectCurrentPlayer = (state) => {
  return state.game.turn.player;
};

export const selectAttackToPossible = (state) => {
  return getAttackToChoices(state.game, state.game.turn.attack.attackFrom)
};

export const selectAttackFromPossible = (state) => {
  return getAttackFromChoices(state.game)
};

export const selectFortifyFromPossible = (state) => {
  return getFortifyFromChoices(state.game)
};
export const selectFortifyToPossible = (state) => {
  return getFortifyToChoices(state.game, state.game.turn.fortify.fortifyFrom)
};

export const selectFortifyReady = (state) => {
  return (
    state.game.turn.fortify?.fortifyFrom && state.game.turn.fortify?.fortifyTo
  );
};

export const selectOwnTerritories = (state) => {
  return getOwnTerritories(state.game)
};
export const selectTerritories = (state, playerId) => {
  return getTerritories(state.game, playerId);
};

export const selectTroopsCount = (state, playerId) => {
  const reducer = (totalTroops, territoryId) => totalTroops + state.game.map.entities[territoryId].troopsCount;
  return getTerritories(state.game, playerId).reduce(reducer, 0)
}


export const selectNeutralTerritories = (state) => {
  return state.game.map.ids.filter((id) => {
    return hasNoOwner(state.game, id)
  });
};
