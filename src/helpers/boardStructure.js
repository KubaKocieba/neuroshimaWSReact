export const boardStructure = () => {
  let hexFields = {};

  for (let i = 1; i <= 19;i++){
    hexFields[i]  = {
      content: false,
      sides: hexFieldNeighbour(i)
    }
  }
  return hexFields;
};

let hexFieldNeighbour = (field) => {
  let neighbours = {
    'u' : field - 1,
    'ur': field + (field > 3 && field < 13 ? 4 : 3),
    'dr': field + (field > 3 && field < 13 ? 5 : 4),
    'd' : field + 1,
    'dl': field - (field > 7 && field < 17 ? 4 : 3),
    'ul': field - (field > 7 && field < 17 ? 5:  4)
  };

  Object.keys(neighbours).forEach(neighbour =>{
    if (neighbours[neighbour] <= 0 || neighbours[neighbour] > 19){
      delete neighbours[neighbour];
    }
  });

  let upperEdge = [1, 4, 8, 13 ,17],
    lowerEdge = [3, 7, 12 ,16];

  if (upperEdge.indexOf(field) !== -1){
    delete neighbours['u'];
  }

  if (lowerEdge.indexOf(field) !== -1){
    delete neighbours['d'];
  }

  if (field === 8){
    delete neighbours['ur'];
    delete neighbours['ul'];
  }

  if (field === 12){
    delete neighbours['dr'];
    delete neighbours['dl'];
  }

  if (field===7)
  {
    delete neighbours['dl'];
  }

  if (field === 13){
    delete neighbours['ur']
  }

  return neighbours;
};
