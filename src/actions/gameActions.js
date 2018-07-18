export const startGame = (activePlayer) => {
  return {
    type: 'START_GAME',
    payload: activePlayer
  }
}

export const nextPlayer = (nextPlayer) => {
  return {
    type: 'NEXT_PLAYER',
    payload: nextPlayer
  }
}