export const setTile = (tile, socket) => {
    return {
        type: 'TILE_SET',
        which: tile.target,
        tile,
        socket
    }
};

export const putTile = (tile,socket) => {
    return {
        type: 'TILE_ONBOARD',
        which: tile.target,
        tile
    }
};