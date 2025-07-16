import { useState } from 'react';
import NameInput from './components/NameInput';
import Game2048 from './components/Game2048';
import NavBar from './components/NavBar';

function App() {
  const [playerName, setPlayerName] = useState('');

  return (
    <div className="app">
      <NavBar />
      {playerName ? (
        <Game2048 name={playerName} />
      ) : (
        <NameInput onSubmit={setPlayerName} />
      )}
    </div>
  );
}

export default App;
