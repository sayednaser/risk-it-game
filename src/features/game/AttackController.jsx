import "./AttackController.css"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  diceRolled,
  attackPerformed,
  selectCurrentPlayer,
  selectDice,
  selectDiceLimit,
  selectMoveTroopsLimit,
  selectisLastAttack,
  selectisFirstAttack,
  selectAttackPossible,
  attackCompleted,
} from "./gameSlice";

import {Die, DieReadOnly} from "../../common/Die"
import Button from "../../common/Button"
import Slider from "../../common/Slider"
const Dice = (props) => {
  const { diceCount, setDiceCount, dice, diceLimit, player } = props;
  let diceArray;
  if (!dice) {
    diceArray = new Array(diceLimit).fill(6);
  } else {
    diceArray = dice;
  }

  const dieComponents = diceArray.map((die, index, array) => {
    return (
      <Die
        key={index}
        index={index}
        number={die}
        width={50}
        diceCount={diceCount}
        setDiceCount={setDiceCount}
      />
    );
  });
  return (
    <div className={`dice-container ${`dice-container-${player}`}`}>
      {dieComponents}
    </div>
  );
};

const DiceReadOnly = (props) => {
  const { dice, player } = props;

  const dieComponents = dice.map((die, index, array) => {
    return <DieReadOnly key={index} index={index} number={die} width={25} />;
  });
  return <div className={`dice-container-readonly ${`dice-container-readonly-${player}`}`}>{dieComponents}</div>;
};

const AttackButton = (props) => {
  const { disabled, attackDiceCount, defenseDiceCount } = props;
  const dispatch = useDispatch();

  const handleClick = (e) => {
    dispatch(diceRolled(attackDiceCount, defenseDiceCount));
    dispatch(attackPerformed())
  }




  return <Button className="btn btn-inline btn-attack" text="Attack" disabled={disabled} onClick={handleClick}/>;
};

const MoveTroopsController = (props) => {
  const { min, max } = props;
  const dispatch = useDispatch();
  const [troopsCount, setTroopsCount] = useState(0);

  const handleClick = (e) => {
    dispatch(attackCompleted(troopsCount));
  };

  return (
    <div className="move-troops-controller">
      <Slider
        min={min}
        max={max}
        state={troopsCount}
        setState={setTroopsCount}
      />
      <Button className="btn btn-inline btn-fortify" onClick={handleClick} text="move" />
    </div>
  );
};

const AttackController = (props) => {
  const attackPossible = useSelector(selectAttackPossible);
  const { attackDiceLimit, defenseDiceLimit } = useSelector(selectDiceLimit);
  const moveTroopsLimit = useSelector(selectMoveTroopsLimit);
  const isFirstAttack = useSelector(selectisFirstAttack);
  const isLastAttack = useSelector(selectisLastAttack);
  const currentPlayer = useSelector(selectCurrentPlayer);

  const { attackDice, defenseDice } = useSelector(selectDice);
  const [attackDiceCount, setAttackDiceCount] = useState(0);
  const [defenseDiceCount, setDefenseDiceCount] = useState(0);

  const togglePlayer = (player) => {
    if (player === '1') {
      return '2';
    } else {
      return '1';
    }
  }

  useEffect(() => {
    if (!isFirstAttack) {
      setAttackDiceCount(Math.min(attackDiceLimit, attackDiceCount));
      setDefenseDiceCount(Math.min(defenseDiceLimit, attackDiceCount));

    }

    return () => {
      setAttackDiceCount(0);
      setDefenseDiceCount(0);
    }
  }, [attackDiceLimit, defenseDiceLimit, attackPossible]);

  return (
    <div className={`attack-controller attack-controller-${currentPlayer}`}>
      <div className={`dices-container ${`dices-container-${currentPlayer}`}`}>

      {attackPossible && !isLastAttack ? (
        <Dice
        diceCount={attackDiceCount}
        setDiceCount={setAttackDiceCount}
        diceLimit={attackDiceLimit}
        player={currentPlayer}
        />
        ) : null}
      {attackPossible && !isFirstAttack ? (
        <DiceReadOnly player={currentPlayer} dice={attackDice} />
        ) : null}
        </div>
      {!isLastAttack ? (
        <AttackButton
          text="attack"
          disabled={
            !attackPossible || attackDiceCount === 0 || defenseDiceCount === 0
          }
          attackDiceCount={attackDiceCount}
          defenseDiceCount={defenseDiceCount}
        />
      ) : (
        <MoveTroopsController min={0} max={moveTroopsLimit} />
      )}
        <div className={`dices-container ${`dices-container-${togglePlayer(currentPlayer)}`}`}>
      {attackPossible && !isLastAttack ? (

        <Dice
          diceCount={defenseDiceCount}
          setDiceCount={setDefenseDiceCount}
          diceLimit={defenseDiceLimit}
          player={togglePlayer(currentPlayer)}
          />
      ) : null}

      {attackPossible && !isFirstAttack ? (
        <DiceReadOnly player={togglePlayer(currentPlayer)} dice={defenseDice} />
        ) : null}
        </div>
    </div>
  );
};

export default AttackController;
