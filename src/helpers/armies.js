import directiveGauss from './Modesto';

const initiativeBoost = () => {
  console.log('all units surrounding base gain +1 to speed');
};

const switchUnitTillFirstAttack = () => {
  console.log('switch unit with another already placed on the board till their first attack, after that they come back and another switch is possible')
};

export const Armies = {
  'celestial' : [
    {
      name: 'hqCelestial',power: directiveGauss ,hp:20
    },
    { name: 'laserShooter',
      amount: 1,
      speed: 2
    },
    { name: 'armouredLaserShooter',
      amount: 1,
      speed: 1,
      defense: 1
    },
    { name: 'boost',
      amount: 3
    }
  ],

  'modesto' : [
    {
      name: 'hqModesto', hp: 20, power: initiativeBoost
    },
    { name: 'laserShooter',
      amount: 1,
      speed: 2
    },
    { name: 'armouredLaserShooter',
      amount: 1,
      speed: 1,
      defense: 1
    },
    { name: 'boost',
      amount: 3
    }
  ],

  'liar' : [
    {
      name: 'hqLiar', hp:20, power: switchUnitTillFirstAttack
    },
    { name: 'laserShooter',
      amount: 1,
      speed: 2
    },
    { name: 'armouredLaserShooter',
      amount: 1,
      speed: 1,
      defense: 1
    },
    { name: 'boost',
      amount: 3
    }
  ]
}