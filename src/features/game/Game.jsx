import {
  attackSelected,
  deploySelected,
  deploySelectedInitial,
  fortifySelected,
} from "./gameSlice";
import { useDispatch, useSelector } from "react-redux";
import AttackPhase from "./AttackPhase";
import DraftPhase from "./DraftPhase";
import InitialPhase from "./InitialPhase";
import Map from "./Map";


const Game = (props) => {
  const {} = props;
  const currentPlayer = useSelector((state) => state.game.turn.player);
  const currentPhase = useSelector((state) => state.game.turn.currentPhase);
  const dispatch = useDispatch()
  const eventHandlers = {
    initial: (e) => {
      const selected = e.target.classList[0];
      dispatch(deploySelectedInitial(selected));
    },
    initial2: (e) => {
      const selected = e.target.classList[0];
      dispatch(deploySelected(selected));
    },
    draft: (e) => {
      const selected = e.target.classList[0];
      dispatch(deploySelected(selected));
    },
    attack: (e) => {
      const selected = e.target.classList[0];
      dispatch(attackSelected(selected))
    },
    fortify: (e) => {
      const selected = e.target.classList[0];
      dispatch(fortifySelected(selected))
    },
    
  }
  
  return (
    <>
      {/* {(() => {
        if (currentPhase === "initial")
        return <InitialPhase player={currentPlayer} />;
        else if (currentPhase === "draft" || currentPhase === 'initial2')
          return <DraftPhase player={currentPlayer} />;
        else return <AttackPhase player={currentPlayer} />;
      })()} */}
      <Map mapName="usa" onClick={eventHandlers[currentPhase]} />
    </>
  );
};

export default Game;
