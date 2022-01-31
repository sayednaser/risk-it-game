import Map from "./Map";
import {
  deploySelected,
} from "./gameSlice";
import { useDispatch, useSelector } from "react-redux";


const DraftPhase = (props) => {
  const { player } = props;
  const dispatch = useDispatch();

  const handleSelected = (e) => {
    const selected = e.target.classList[0];
    dispatch(deploySelected(selected));
  };

  return <Map mapName="usa" onClick={handleSelected} />;
};

export default DraftPhase;
