export const startGame = (activePlayer) => {
  return {
    type: 'START_GAME',
    payload: activePlayer
  }
};

export const nextPlayerStarted = (nextPlayer) => {
  return {
    type: 'NEXT_PLAYER_STARTED',
    activePlayer: nextPlayer.activePlayer,
    playerData: nextPlayer.data
  }
};

export const nextPlayer = (socket, playerData) => {
  return {
    type: 'NEXT_PLAYER',
    socket,
    playerData
  }
};

export const saveSocket = (socket) => {
  return {
    type: 'SAVE_SOCKET',
    payload: socket
  }
};

export const lastRound = (playerInitiatedLastRound) => {
  return {
    type: 'LAST_ROUND',
    payload: playerInitiatedLastRound
  }
};

export const tileRemoveFromHand = (player, tile) => {
    return {
        type: 'HAND_REMOVE_TILE',
        payload:   { player , tile }
    }
};