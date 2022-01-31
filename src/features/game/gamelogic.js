import graphlib from "graphlib";
import _ from "lodash";
import { usaMapTable } from "../../utils/UsaMap";
import { randomGenerator } from "../../utils/utils";

export const GENERATOR = randomGenerator([1, 0, 2, 1]);

export const NO_OWNER = "";
export const NOT_SELECTED = "";
export const NUMBER_OF_PLAYERS = 2;
export const NO_DICE = [];
export const START_PHASE = "initial";
export const POST_START_PHASE = "initial2";
export const DRAFT_PHASE = "draft";
export const ATTACK_PHASE = "attack";
export const FORTIFY_PHASE = "fortify";
export const PLAYERS_IDS = new Array(NUMBER_OF_PLAYERS, 0)
  .fill(0)
  .map((value, index) => (index + 1).toString());
export const INITIAL_TROOPS_COUNT = 40;
export const MAP_TABLE = usaMapTable;

const playerInitState = function (playerId) {
  return {
    id: playerId,
    territoriesCount: 0,
    troopsCount: 0,
  };
};

export const PLAYERS_INIT_STATE = {
  ids: PLAYERS_IDS,
  entities: _.fromPairs(PLAYERS_IDS.map((id) => [id, playerInitState(id)])),
};

export const INIT_START_PHASE_STATE = {
  initialTroops: MAP_TABLE.ids.length,
  selectedInitial: NOT_SELECTED,
};

export const INIT_POST_START_PHASE_STATE = {
  reinforcements: INITIAL_TROOPS_COUNT - MAP_TABLE.ids.length / 2,
  selectedTerritory: NOT_SELECTED,
};

export const INIT_DRAFT_PHASE_STATE = {
  reinforcements: 0,
  selectedTerritory: NOT_SELECTED,
};

export const INIT_ATTACK_PHASE_STATE = {
  attackFrom: NOT_SELECTED,
  attackTo: NOT_SELECTED,
  attackDice: NO_DICE,
  defenseDice: NO_DICE,
};

export const INIT_FORTIFY_PHASE_STATE = {
  fortifyFrom: NOT_SELECTED,
  fortifyTo: NOT_SELECTED,
};

export const togglePlayer = function (state) {
  return (
    ((Number(state.turn.player) - 1 + 1) % NUMBER_OF_PLAYERS) +
    1
  ).toString();
};
export const hasNoOwner = function (state, territory) {
  return state.map.entities[territory]?.owner !== NO_OWNER;
};

export const isOwner = function (state, territory) {
  const owner = state.map.entities[territory]?.owner;

  return owner === state.turn.player;
};

export const isInStartPhase = function (state) {
  return state.turnCount === 0;
};
export const isDraftFinish = function (state) {
  return state.turn.draft.reinforcements === 0;
};

export const getOwnTerritories = (state) => {
  return state.map.ids.filter((id) => isOwner(state, id));
};

export const getTerritories = function (state, playerId) {
  return state.map.ids.filter(
    (id) => state.map.entities[id]?.owner === playerId
  );
};

const calculateReinforcements = function (territoriesCount) {
  return Math.max(Math.floor(territoriesCount / 3), 3);
};

export const turnStartedUtil = function (state) {
  state.turnCount++;
  const turn = state.turn;
  turn.player = togglePlayer(state);

  turn.currentPhase = DRAFT_PHASE;
  turn.draft.reinforcements = calculateReinforcements(
    getOwnTerritories(state).length
  );
  turn.attack = INIT_ATTACK_PHASE_STATE;
  turn.fortify = INIT_FORTIFY_PHASE_STATE;
};

export const getAttackToChoices = function (state, attackFrom) {
  /* Get the territories I can attack
   * Criteria:
   * - I don't own it.
   * - Neighbour.
   */

  if (!attackFrom) {
    return [];
  }

  return state.map.ids.filter((id) => {
    const territory = state.map.entities[id];
    return (
      !isOwner(state, id) &&
      state.map.entities[attackFrom].neighbours.includes(territory.id)
    );
  });
};

export const getAttackFromChoices = (state) => {
  /* Get the territories I can attack from
   * Criteria:
   * - I own it.
   * - Has more than 1 troop.
   * - Has neighbours I can attack
   */

  return state.map.ids.filter((id) => {
    const territory = state.map.entities[id];
    return (
      isOwner(state, id) &&
      territory.troopsCount > 1 &&
      getAttackToChoices(state, territory.id).length > 0
    );
  });
};

export const fortifyToPossible = (state, fortifyFrom) => {
  if (!fortifyFrom) {
    return [];
  }
  const ownTerritoriesIds = state.map.ids.filter(
    (id) => state.map.entities[id].owner === state.turn.player
  );
  const ownTerritories = _.pick(state.map.entities, ownTerritoriesIds);
  const ownTerritoriesGraph = buildGraph(ownTerritories);
  return getConnectedTo(fortifyFrom, ownTerritoriesGraph);
};

const buildGraph = function (map) {
  const graph = new graphlib.Graph({ directed: false });

  Object.keys(map).forEach((key) => {
    graph.setNode(key, key);
  });
  Object.entries(map).forEach(([key, value]) => {
    value.neighbours.forEach((neighbour) => {
      if (Object.keys(map).includes(neighbour))
        graph.setEdge(key, neighbour, `${key} ${neighbour}`);
    });
  });

  return graph;
};

const getConnectedTo = function (node, graph) {
  const cc = graphlib.alg.components(graph);

  let connectedTo;

  for (let component of cc) {
    for (let key of component) {
      if (key === node) {
        connectedTo = _.without(component, node);
        return connectedTo;
      }
    }
  }
};

export const getFortifyToChoices = function (state, fortifyFrom) {
  /* Get the territories I can fortify to
   * Criteria:
   * - I own it.
   * - connected to fortify from.
   */
  if (!fortifyFrom) {
    return [];
  }

  const ownTerritoriesIds = state.map.ids.filter((id) => isOwner(state, id));
  const ownTerritories = _.pick(state.map.entities, ownTerritoriesIds);
  const ownTerritoriesGraph = buildGraph(ownTerritories);
  return getConnectedTo(fortifyFrom, ownTerritoriesGraph);
};

export const getFortifyFromChoices = (state) => {
  /* Get the territories I can fortify from
   * Criteria:
   * - I own it.
   * - Has more than 1 troop.
   * - Has connected territories
   */

  return state.map.ids.filter((id) => {
    const territory = state.map.entities[id];
    return (
      isOwner(state, id) &&
      territory.troopsCount > 1 &&
      getFortifyToChoices(state, territory.id).length > 0
    );
  });
};

const ATTACK_SYMBOL = "attack";
const DEFENSE_SYMBOL = "defense";

const determineWinner = function (state) {
  const { attackDice, defenseDice } = state.turn.attack;
  const winnerArray = [];
  defenseDice.forEach((defenseDie, index) => {
    const temp =
      defenseDie >= attackDice[index] ? DEFENSE_SYMBOL : ATTACK_SYMBOL;
    winnerArray.push(temp);
  });
  return winnerArray;
};

const calculateLoss = function (winnerArray) {
  const attackLoss = winnerArray.filter((winner) => winner === DEFENSE_SYMBOL);
  const defenseLoss = winnerArray.filter((winner) => winner === ATTACK_SYMBOL);

  return { attackLoss: attackLoss.length, defenseLoss: defenseLoss.length };
};

export const getLosses = function (state) {
  const winnerArray = determineWinner(state);

  return calculateLoss(winnerArray);
};

export const getNextPhase = function (state) {
  const phases = [DRAFT_PHASE, ATTACK_PHASE, FORTIFY_PHASE];

  const index = phases.findIndex((phase) => phase === state.turn.currentPhase);

  return phases[(index + 1) % phases.length];
};
