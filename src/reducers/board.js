import { boardStructure } from '../helpers/boardStructure';

export default (state = {
    fields: boardStructure()
}, action) => {
    switch(action.type){
        case 'TILE_MOVE':
            return state;
        case 'TILE_SET':
            action.socket.send(JSON.stringify({type: 'tile_set', data: action.tile}));
            return state;

        case 'TILE_ONBOARD':
            const stateCpy = { ...state};

            stateCpy.fields[action.which].content = action.tile;

            return stateCpy;
        default:
            return state;
    }
}