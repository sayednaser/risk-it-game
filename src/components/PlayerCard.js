import "../css/components/PlayerCard.css";
import Avatar from "./Avatar";
import PlayerInfo from "./PlayerInfo";

import { playerToClasses } from "../utils";

const PlayerCard = (props) => {
  const { player } = props;
  const classes = playerToClasses(player, {
    playerCard: "player-card",
  });
  const info = {
    Conqured: "50%",
    Army: "500 (+200)",
    Phase: "Draft",
  };

  return (
    <div className={`player-card ${classes.playerCard}`}>
      <Avatar player={player} />
      <PlayerInfo player={player} info={info} />
    </div>
  );
};

export default PlayerCard;
