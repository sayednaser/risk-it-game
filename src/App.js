import logo from './logo.svg';
import './App.css';

import Button from './components/Button.js'
import Heading from './components/Heading.js'
import Avatar from './components/Avatar.js'
import PlayerInfo from './components/PlayerInfo';
import PlayerCard from './components/PlayerCard';
function App() {
  const info = {
    Conqured: '50%',
    Army: '500 (+200)',
  Phase: 'Draft'};
  return (
    <div className="App">
      <header className="App-header">
        {/* <Button text='start'/> */}
        {/* <Button text='About'/> */}
        {/* <Heading className="heading-main" text="RISK it"/> */}
        <PlayerCard player="2"/>
      </header>
    </div>
  );
}

export default App;
