export const hexDirectionsChange = (toChange, scroll) => {
  const directions  = [
  'u',
  'ur',
  'dr',
  'd',
  'dl',
  'ul'
  ];

  console.log(toChange);

  let turning = scroll > 0 ? 1 : -1;

  let newDirections = [];

  toChange.forEach((direction,index)=> {
    direction = directions.findIndex(dir=>{
        return dir === direction;
      }) + turning;

    console.log(direction);

    if(direction > directions.length -1)
    {
      direction = 0;
    }
    else if (direction < 0){
      direction = directions.length-1;
    }

    newDirections.push(directions[direction]);
  })

  return newDirections;
};