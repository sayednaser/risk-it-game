import "./PlayerCard.css";
import Avatar from "../../common/Avatar";
import PlayerInfo from "../../common/PlayerInfo";

import { playerToClasses } from "../../utils/utils";
import { useSelector } from "react-redux";
import NextPhaseButton from "./NextPhaseButton";
import {selectCurrentPlayer, selectTerritories, selectTroopsCount } from "./gameSlice";

const PlayerCard = (props) => {
  const { player } = props;


  const currentPlayer = useSelector(selectCurrentPlayer);
  const territoriesCount = useSelector(
    (state) => selectTerritories(state, player).length
  );
  const troopsCount = useSelector((state) => selectTroopsCount(state, player));
  const classes = playerToClasses(player, {
    playerCard: "player-card",
  });
  const reinforcementsCount = useSelector(state => state.game.turn.draft.reinforcements)
  const info = {
    Conqured: `${Math.round((territoriesCount / 42) * 100)}%`,
    Army: `${troopsCount}${(reinforcementsCount && currentPlayer === player) ? ` (+${reinforcementsCount})` : ''}`,
  };

  return (
    <div className={`player-card player-card-${classes.playerCard}`}>
      {/* <Avatar player={player} /> */}
      <PlayerInfo player={player} info={info} />
    </div>
  );
};

export default PlayerCard;
