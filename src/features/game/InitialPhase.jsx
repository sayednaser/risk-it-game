import Map from "./Map";
import {
  deploySelectedInitial,
} from "./gameSlice";
import { useDispatch } from "react-redux";

const InitialPhase = (props) => {
  const { player } = props;
  const dispatch = useDispatch();

  const handleSelected = (e) => {
    const selected = e.target.classList[0];
    dispatch(deploySelectedInitial(selected));
  };

  return <Map mapName="usa" onClick={handleSelected} />;
};

export default InitialPhase;
