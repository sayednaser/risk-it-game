import "../../common/PlayerInfo.css";
import "./PlayerCard.css";

import Avatar from "../../common/Avatar";

import { playerToClasses } from "../../utils/utils";
import { useSelector } from "react-redux";
import NextPhaseButton from "./NextPhaseButton";

const capitalize = function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const PlayerInfo = (props) => {
  const { info } = props;

  const infoArray = Object.keys(info).map((key) => {
    return { [capitalize(key)]: info[key] };
  });
  const infoJsx = infoArray.map((keyValuePair) => {
    return (
      <tr key={Object.keys(keyValuePair)[0]}>
        <th>{Object.keys(keyValuePair)[0]}:</th>
        <td>{Object.values(keyValuePair)[0]}</td>
      </tr>
    );
  });

  return (
    <table className="player-info">
      <colgroup>
        <col className="" />
        <col className="col-values" />
      </colgroup>
      <tbody>
          <tr>
              
          {Object.keys(info).map(key => <td key={key}>{capitalize(key)}</td>)}
          </tr>
          <tr>
          {Object.values(info).map(value => <td key={value}>{value}</td>)}
          </tr>
          </tbody>
    </table>
  );
};

const PlayerCard2 = (props) => {
  const { player } = props;

  const territoriesCount = useSelector(
    (state) => state.game.players.entities[player].territoriesCount
  );
  const troopsCount = useSelector(
    (state) => state.game.players.entities[player].troopsCount
  );
  const classes = playerToClasses(player, {
    playerCard: "player-card",
  });
  const info = {
    Conqured: `${Math.round((territoriesCount / 42) * 100)}%`,
    Army: `${troopsCount}`,
    Phase: "",
  };

  return (
    <div className={`player-card ${classes.playerCard}`}>
      {/* <Avatar player={player} /> */}
      <PlayerInfo player={player} info={info} />
      {/* <NextPhaseButton player={player} /> */}
    </div>
  );
};

export default PlayerCard2;
