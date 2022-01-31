import "./Die.css";
import die1 from "../assets/dice/die-1.svg";
import die2 from "../assets/dice/die-2.svg";
import die3 from "../assets/dice/die-3.svg";
import die4 from "../assets/dice/die-4.svg";
import die5 from "../assets/dice/die-5.svg";
import die6 from "../assets/dice/die-6.svg";
import classNames from "classnames";

const dice = [die1, die2, die3, die4, die5, die6];

const Die = (props) => {
  const { number, width, index, diceCount, setDiceCount } = props;

  const classes = [];

  if (index > diceCount) {
    classes.push("die-invisible");
  }
  if (index >= diceCount) {
    classes.push("die-opaque");
  }

  const handleClick = (e) => {
    if (index === diceCount) {
      setDiceCount((prevState) => prevState + 1);
    } else if (index - diceCount === -1) {
      setDiceCount((prevState) => prevState - 1);
    }
  };

  return (
    <div className={classNames(classes, "die")} onClick={handleClick}>
      <img src={dice[number - 1]} width={width} />
    </div>
  );
};
const DieReadOnly = (props) => {
  const { number, width } = props;

  const classes = [];

  return (
    <div className={classNames(classes, "die")}>
      <img src={dice[number - 1]} width={width} />
    </div>
  );
};

export { Die, DieReadOnly };
export default Die;
