import { useEffect, useState } from 'react';
import './Game2048.css';

function Game2048({ name }) {
  const [grid, setGrid] = useState(createEmptyGrid());
  const [mergeMap, setMergeMap] = useState(createEmptyGrid().map(row => row.map(() => false)));
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;

      let moved = null;
      switch (e.key) {
        case 'ArrowLeft': moved = moveLeft(grid); break;
        case 'ArrowRight': moved = moveRight(grid); break;
        case 'ArrowUp': moved = moveUp(grid); break;
        case 'ArrowDown': moved = moveDown(grid); break;
        default: return;
      }

      if (moved?.changed) {
        const withNewTile = addRandomTile(moved.grid);
        setGrid(withNewTile);
        setMergeMap(moved.mergeMap);
        setScore(prev => prev + (moved.scoreGained || 0));
        if (checkGameOver(withNewTile)) handleGameOver();
      }
    };

    let startX = null;
    let startY = null;

    function handleTouchStart(e) {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
    }

    function handleTouchEnd(e) {
      if (startX === null || startY === null) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      let moved = null;
      if (absX > absY) {
        if (dx > 20) moved = moveRight(grid);
        else if (dx < -20) moved = moveLeft(grid);
      } else {
        if (dy > 20) moved = moveDown(grid);
        else if (dy < -20) moved = moveUp(grid);
      }

      if (moved?.changed) {
        const withNewTile = addRandomTile(moved.grid);
        setGrid(withNewTile);
        setMergeMap(moved.mergeMap);
        setScore(prev => prev + (moved.scoreGained || 0));
        if (checkGameOver(withNewTile)) handleGameOver();
      }

      startX = null;
      startY = null;
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [grid, gameOver]);

  function startNewGame() {
    let newGrid = createEmptyGrid();
    newGrid = addRandomTile(addRandomTile(newGrid));
    setGrid(newGrid);
    setMergeMap(createEmptyGrid().map(row => row.map(() => false)));
    setScore(0);
    setGameOver(false);
    const existing = JSON.parse(localStorage.getItem('aztec2048-history')) || [];
    setHistory(existing);
  }

  function handleGameOver() {
    setGameOver(true);
    const newEntry = {
      name,
      score,
      time: new Date().toLocaleString(),
    };

    // Save personal history
    const existingHistory = JSON.parse(localStorage.getItem('aztec2048-history')) || [];
    const updatedHistory = [newEntry, ...existingHistory];
    localStorage.setItem('aztec2048-history', JSON.stringify(updatedHistory));
    setHistory(updatedHistory);

    // Save or update global leaderboard
    const leaderboard = JSON.parse(localStorage.getItem('aztec2048-leaderboard')) || [];
    const existingPlayerIndex = leaderboard.findIndex((entry) => entry.name === name);
    if (existingPlayerIndex !== -1) {
      if (score > leaderboard[existingPlayerIndex].score) {
        leaderboard[existingPlayerIndex] = newEntry;
      }
    } else {
      leaderboard.push(newEntry);
    }
    leaderboard.sort((a, b) => b.score - a.score);
    localStorage.setItem('aztec2048-leaderboard', JSON.stringify(leaderboard.slice(0, 100)));
  }

  return (
    <div className="game-wrapper">
      <div className="game-container">
        <h2>Welcome, {name}</h2>
        <p className="score">Score: {score}</p>

        <div className="grid">
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`tile tile-${cell} ${mergeMap[rowIndex][colIndex] ? 'merged' : ''}`}
              >
                {cell !== 0 ? cell : ''}
              </div>
            ))
          )}
        </div>

        {gameOver && (
          <div className="game-over">
            <p>Game Over 💀</p>
            <button onClick={startNewGame} className="restart-btn">Play Again</button>
          </div>
        )}
      </div>

      <div className="history-panel">
        <h3>Past Games</h3>
        <ul>
          {history
            .filter(entry => entry.name === name)
            .slice(0, 5)
            .map((entry, index) => (
              <li key={index}>
                {entry.score} pts — <span>{entry.time}</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

// --- Helpers ---

function createEmptyGrid() {
  return Array(4).fill(null).map(() => Array(4).fill(0));
}

function addRandomTile(grid) {
  const empty = [];
  grid.forEach((row, r) =>
    row.forEach((cell, c) => {
      if (cell === 0) empty.push([r, c]);
    })
  );
  if (empty.length === 0) return grid;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const newGrid = grid.map(row => [...row]);
  newGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
  return newGrid;
}

function moveLeft(grid) {
  let changed = false;
  const newGrid = [];
  const mergeMap = [];
  let scoreGained = 0;

  for (let row of grid) {
    const filtered = row.filter(n => n !== 0);
    const combined = [];
    const mergedRow = [];
    let i = 0;

    while (i < filtered.length) {
      if (filtered[i] === filtered[i + 1]) {
        const merged = filtered[i] * 2;
        combined.push(merged);
        mergedRow.push(true);
        scoreGained += merged;
        i += 2;
        changed = true;
      } else {
        combined.push(filtered[i]);
        mergedRow.push(false);
        i++;
      }
    }

    while (combined.length < 4) {
      combined.push(0);
      mergedRow.push(false);
    }

    if (!changed && !arraysEqual(row, combined)) changed = true;

    newGrid.push(combined);
    mergeMap.push(mergedRow);
  }

  return { grid: newGrid, changed, mergeMap, scoreGained };
}

function moveRight(grid) {
  const reversed = grid.map(row => [...row].reverse());
  const moved = moveLeft(reversed);
  return {
    grid: moved.grid.map(row => row.reverse()),
    changed: moved.changed,
    mergeMap: moved.mergeMap.map(row => row.reverse()),
    scoreGained: moved.scoreGained,
  };
}

function moveUp(grid) {
  const transposed = transpose(grid);
  const moved = moveLeft(transposed);
  return {
    grid: transpose(moved.grid),
    changed: moved.changed,
    mergeMap: transpose(moved.mergeMap),
    scoreGained: moved.scoreGained,
  };
}

function moveDown(grid) {
  const transposed = transpose(grid).map(row => row.reverse());
  const moved = moveLeft(transposed);
  return {
    grid: transpose(moved.grid.map(row => row.reverse())),
    changed: moved.changed,
    mergeMap: transpose(moved.mergeMap.map(row => row.reverse())),
    scoreGained: moved.scoreGained,
  };
}

function transpose(matrix) {
  return matrix[0].map((_, i) => matrix.map(row => row[i]));
}

function arraysEqual(a, b) {
  return a.every((val, i) => val === b[i]);
}

function checkGameOver(grid) {
  for (let row of grid) if (row.includes(0)) return false;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const current = grid[r][c];
      const right = grid[r][c + 1];
      const down = grid[r + 1]?.[c];
      if (current === right || current === down) return false;
    }
  }
  return true;
}

export default Game2048;
