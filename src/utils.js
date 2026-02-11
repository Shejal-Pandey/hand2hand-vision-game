
export const MOVES = {
    ROCK: 'Stone',
    PAPER: 'Paper',
    SCISSORS: 'Scissor',
    NONE: 'None'
};

export const MOVE_EMOJIS = {
    [MOVES.ROCK]: '✊',
    [MOVES.PAPER]: '✋',
    [MOVES.SCISSORS]: '✌️',
    [MOVES.NONE]: '❓'
};

export const GAME_STATES = {
    IDLE: 'IDLE',       // Intro screen
    COUNTDOWN: 'COUNTDOWN', // 3..2..1
    PLAYING: 'PLAYING', // Detecting move
    RESULT: 'RESULT',   // Showing round result
    FINISHED: 'FINISHED' // Final score
};

export const determineWinner = (playerMove, subMove) => {
    // Map raw mediapipe moves to game logic
    // Note: MediaPipe returns "Victory" for scissors.

    // Normalize moves
    const p = playerMove; // e.g. "Victory"
    const c = subMove;

    if (p === c) return 'tie';
    if (p === MOVES.NONE || c === MOVES.NONE) return 'tie'; // Should handle 'no detection'

    if (
        (p === MOVES.ROCK && c === MOVES.SCISSORS) ||
        (p === MOVES.SCISSORS && c === MOVES.PAPER) ||
        (p === MOVES.PAPER && c === MOVES.ROCK)
    ) {
        return 'user';
    }

    return 'cpu';
};

export const getRandomMove = () => {
    const moves = [MOVES.ROCK, MOVES.PAPER, MOVES.SCISSORS];
    return moves[Math.floor(Math.random() * moves.length)];
};
