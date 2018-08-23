import {Armies} from "./armies";

export const tilesFillWithRepeated = (tiles) => {
  let setTiles = tiles.reduce((res, curr)=>{
    for(let i = 0; i < curr.amount; i++){
      var {amount, ...rest} = curr;

      res = res.concat([rest]);
    }

    return res;
  }, []);

  return [Armies[sessionStorage.getItem('army')][0], ...setTiles];
}