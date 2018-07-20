export const startGame = (activePlayer) => {
  return {
    type: 'START_GAME',
    payload: activePlayer
  }
}

export const nextPlayerStarted = (nextPlayer) => {
  return {
    type: 'NEXT_PLAYER_STARTED',
    payload: nextPlayer
  }
}

export const nextPlayer = (socket) => {
  return {
    type: 'NEXT_PLAYER',
    payload: socket
  }
}

export const saveSocket = (socket) => {
  return {
    type: 'SAVE_SOCKET',
    payload: socket
  }
}