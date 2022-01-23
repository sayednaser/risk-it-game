import "../css/components/PlayerInfo.css";

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
      <tbody>{infoJsx}</tbody>
    </table>
  );
};

export default PlayerInfo;
