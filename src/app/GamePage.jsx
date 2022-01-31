import Game from "../features/game/Game";
import PlayerCard from "../features/game/PlayerCard";
import PlayerCard2 from "../features/game/PlayerCard2";
import PlayerControl from "../features/game/PlayerController";

import "./GamePage.css"

const GamePage = (props) => {
  return (
      <main className="game-page">
        <section className="game-page-header">
          <PlayerCard player="1" />
          <PlayerControl />
          <PlayerCard player="2" />
        </section>
        <section className="game-page-map">
          <Game />
        </section>
      </main>
  );
};

export default GamePage