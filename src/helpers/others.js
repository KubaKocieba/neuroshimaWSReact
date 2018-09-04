import React from 'react';

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1)
}

export const findFreeField = (fields) => {
  let freeFieldsArr = [];

  Object.keys(fields)
  .forEach(field=>{
    if (!fields[field].content){
      freeFieldsArr.push(field);
    }
  });

  return freeFieldsArr[Math.floor(Math.random() * freeFieldsArr.length)];
};

export const directionsDraw = (tileDirections, hexSize, transform) => {
      if (tileDirections){
      const directions = {
        'ul' : 1,
        'u'  : 2,
        'ur' : 3,
        'dr' : 4,
        'd'  : 5,
        'dl' : 6
      };

      var examine = [];

      tileDirections.forEach(direction=>{
        if (direction === 'all'){
          examine = [1,2,3,4,5,6];
          return;
        }
        else{
          examine.push(directions[direction]);
        }
      });

      const offX = 0.04*hexSize,
            dispX = [
              hexSize/2 +offX,   //'ul'
              hexSize*1.5,       //'u'
              2*hexSize - offX,  //'ur'
              1.5*hexSize-Math.sqrt(3)*offX , //'dr'
              hexSize/2,         //'d'
              offX                // 'dl'
            ],
            dispY = [
              offX,
              Math.sqrt(3)*offX,
              (hexSize/2)*Math.sqrt(3)+ offX,
              1.75*hexSize,
              1.75*hexSize - 2*offX,
              (hexSize/2)*Math.sqrt(3) -offX
            ],
            hit = `0 ${(hexSize/2)*Math.sqrt(3)}, ${(hexSize/4)*Math.sqrt(3)} ${hexSize/2}, 0 ${hexSize-hexSize/2*Math.sqrt(3)}`,
            shot = `0 ${0.3*hexSize}, ${(hexSize/3)*Math.sqrt(3)} ${hexSize/2}, 0 ${0.7*hexSize}`;

        const getDirs = examine.map((el,index) => {
            return <polyline key={el}
            //dla strzału 0 ${(hexSize/4)}, ${(hexSize/4)*Math.sqrt(3)} ${hexSize/2}, 0 ${0.75*hexSize}
                      points={shot}
                      transform={`
                        ${transform}
                        translate(${dispX[el-1]}  ${dispY[el-1]} )
                        rotate(${30+(el-1)*60}, 0, 0)`
                      }

                      fill="black"
                   ></polyline>;
        });

        return getDirs;
    }
}