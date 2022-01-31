import Map from "./Map";
import {
  attackSelected, selectAttackToPossible,
} from "./gameSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

const AttackPhase = (props) => {
  const { player } = props;
  const dispatch = useDispatch();
  

  const handleSelected = (e) => {
    const selected = e.target.classList[0];
    dispatch(attackSelected(selected))
  };

  return (
      <>
      <Map mapName="usa" onClick={handleSelected} />;
      </>
  )
  
};

export default AttackPhase;
