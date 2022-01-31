import { capitalize } from "lodash";
import NextPhaseButton from "../features/game/NextPhaseButton";
import "./PlayerInfo.css";



const PlayerInfo = (props) => {
  const { info, player } = props;

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
    <table className={`player-info player-info-${player}`}>
      <colgroup>
        <col className="" />
        <col className="col-values" />
      </colgroup>
      <tbody>{infoJsx}
      <tr>
        <th>Phase:</th>
        <td>
      <NextPhaseButton player={player} />

        </td>
      </tr>
      </tbody>
    </table>
  );
};

export default PlayerInfo;
