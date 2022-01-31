import Button from "../../common/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  nextPhase,
  selectCurrentPhase,
  selectCurrentPlayer,
  turnStarted,
} from "./gameSlice";
import { capitalize } from "lodash";

const NextPhaseButton = (props) => {
  const { player } = props;
  const dispatch = useDispatch();
  const currentPhase = useSelector(selectCurrentPhase);
  const currentPlayer = useSelector(selectCurrentPlayer);

  let text = player === currentPlayer ? capitalize(currentPhase) : " ";
  if (text === 'Initial' || text === 'Initial2') {
    text = 'Start';
  }
  const disabled =
    ["initial", "initial2"].includes(currentPhase) || player !== currentPlayer;

  const handleClick = (e) => {
    if (currentPhase === "fortify") {
      dispatch(turnStarted());
    } else {
      dispatch(nextPhase());
    }
  };

  return (
    <Button
      className="btn btn-inline btn-next-phase"
      text={text}
      disabled={disabled}
      onClick={handleClick}
    />
  );
};

export default NextPhaseButton;
