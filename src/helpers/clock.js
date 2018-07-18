import * as gameActions from '../actions/gameActions'

export const clockTimer = () => {
  let tick = setInterval(()=> {
            console.log('tick');
      }, 1000);

      setTimeout(()=>{
        clearInterval(tick);
        //gameActions.nextPlayer();
        clockTimer();
      }, 90000);
}