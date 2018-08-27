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
      name: 'hqCelestial',power: directiveGauss ,hp:20,
      directions: ['all']
    },
    { name: 'laserShooter',
      amount: 1,
      speed: 2,
      directions: ['u']
    },
    { name: 'armouredLaserShooter',
      amount: 1,
      speed: 1,
      defense: 1,
      directions: ['u']
    },
    { name: 'boost',
      amount: 3,
      directions: ['ul', 'dr']
    }
  ],

  'modesto' : [
    {
      name: 'hqModesto',
      hp: 20,
      power: initiativeBoost,
      directions: ['all']
    },
    { name: 'laserShooter',
      amount: 1,
      speed: 2,
      directions: ['u']
    },
    { name: 'armouredLaserShooter',
      amount: 1,
      speed: 1,
      defense: 1,
      directions: ['u']
    },
    { name: 'boost',
      amount: 3,
      directions: ['ul', 'dr']
    }
  ],

  'liar' : [
    {
      name: 'hqLiar', hp:20, power: switchUnitTillFirstAttack
    },
    { name: 'laserShooter',
      amount: 1,
      speed: 2,
      directions: ['u']
    },
    { name: 'armouredLaserShooter',
      amount: 1,
      speed: 1,
      defense: 1,
      directions: ['u']
    },
    { name: 'boost',
      amount: 3,
      directions: ['ul', 'dr']
    }
  ]
}