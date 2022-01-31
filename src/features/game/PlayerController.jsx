import { useSelector } from "react-redux";
import { selectCurrentPhase } from "./gameSlice";
import AttackController from "./AttackController";
import FortifyController from "./FortifyController";

const PlayerController = (props) => {
  const currentPhase = useSelector(selectCurrentPhase);

  switch (currentPhase) {
    case "initial":
      return null;
      break;
    case "initial2":
      return null;
      break;
    case "draft":
      return null;
    case "attack":
      return <AttackController />;
      break;
    case "fortify":
      return <FortifyController />;
      break;
    default:
      return null;
      break;
  }
};

export default PlayerController;
