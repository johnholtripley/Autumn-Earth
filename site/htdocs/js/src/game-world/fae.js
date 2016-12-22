function animateFae() {
    fae.z = Math.floor((Math.sin(fae.dz) + 1) * 8 + 40);
    fae.dz += 0.2;
// fae.y+=8;
    for (var i = 0; i < fae.particles.length; i++) {
        fae.particles[i].alpha -= 0.1;
        if(fae.particles[i].alpha<=0) {
            fae.particles.splice(i, 1);
        }
    }

    // add particles:
    if (fae.particles.length < fae.maxParticles) {
        if (getRandomInteger(1, 4) == 1) {
            var faeIsoX = findIsoCoordsX(fae.x, fae.y);
            var faeIsoY = findIsoCoordsY(fae.x, fae.y) - fae.z;
            var particleIsoX = faeIsoX + getRandomInteger(0, 8) - 4;
            var particleIsoY = faeIsoY + getRandomInteger(0, 8) - 4;
            // check it's in a circle from the fae's centre:
            if (isInRange(faeIsoX, faeIsoY, particleIsoX, particleIsoY, 6)) {

                fae.particles.push({ 'depth': findIsoCoordsY(fae.x, fae.y),'isoX': particleIsoX, 'isoY': particleIsoY, 'alpha': 1 });
            
            }
        }
    }
}

function moveFae() {
    switch (fae.currentState) {
  case "away":
  moveFaeToDestination(400,600);
    break;
  case "back":
    break;
    case "wait":
    break;
  default:
    // "hero"
    break;
}
}

function moveFaeToDestination(x,y) {
// check pythagoras distance, and if more than fae speed, move as far on that vector as fae speed, otherwise move to half way to destination so fae decelerates
// ###
console.log(fae.speed);
}