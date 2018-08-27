export const setTile = (tile, socket) => {
    return {
      type: 'TILE_SET',
      which: tile.target,
      tile,
      socket
    }
};

export const putTile = (tile) => {
    console.log(tile);

    return {
      type: 'TILE_ONBOARD',
      which: tile.target,
      tile,
      color: tile.color
    }
};