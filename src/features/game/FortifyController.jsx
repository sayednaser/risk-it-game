import "./FortifyController.css";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../common/Button";
import Slider from "../../common/Slider";
import {
  fortifyPerformed,
  selectCurrentPlayer,
  selectfortifyLimit,
  selectFortifyReady,
} from "./gameSlice";

const MoveTroopsController = (props) => {
  const { min, max } = props;
  const dispatch = useDispatch();
  const [troopsCount, setTroopsCount] = useState(0);

  const handleClick = (e) => {
    console.log(troopsCount);
    dispatch(fortifyPerformed(troopsCount));
  };

  return (
    <div className="move-troops-controller">
      <Slider
        min={min}
        max={max}
        state={troopsCount}
        setState={setTroopsCount}
      />
      <Button
        className="btn btn-inline btn-fortify"
        onClick={handleClick}
        text="Move"
      />
    </div>
  );
};

const FortifyController = (props) => {
  const fortifyLimit = useSelector(selectfortifyLimit);
  const currentPlayer = useSelector(selectCurrentPlayer);
  const fortifyReady = useSelector(selectFortifyReady);

  return (
    <div className={`fortify-controller fortify-controller-${currentPlayer}`}>
      {fortifyReady ? (
        <MoveTroopsController min={0} max={fortifyLimit} />
      ) : null}
    </div>
  );
};

export default FortifyController;
