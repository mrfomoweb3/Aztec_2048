import { useState } from 'react';

function NameInput({ onSubmit }) {
  const [name, setName] = useState('');

  const handleStart = () => {
    if (name.trim()) onSubmit(name.trim());
  };

  return (
    <div className="name-input">
      <img src="/logo.png" alt="Aztec-2048 Logo" className="logo" />
      <h2>Enter your name to begin</h2>
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={handleStart}>Start Game</button>
    </div>
  );
}

export default NameInput;
