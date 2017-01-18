function animateFae() {
    //fae.z = Math.floor((Math.sin(fae.dz) + 1) * 8 + 40);
    fae.dz += 0.2;
    // fae.y+=8;
    for (var i = 0; i < fae.particles.length; i++) {
        fae.particles[i].alpha -= 0.1;
        if (fae.particles[i].alpha <= 0) {
            fae.particles.splice(i, 1);
        }
    }

    // add particles:
    if (fae.particles.length < fae.maxParticles) {
        if (getRandomInteger(1, 2) == 1) {
            var faeIsoX = findIsoCoordsX(fae.x, fae.y);
            var faeIsoY = findIsoCoordsY(fae.x, fae.y) - fae.oscillateOffset;
            var particleIsoX = faeIsoX + getRandomInteger(0, 8) - 4;
            var particleIsoY = faeIsoY + getRandomInteger(0, 8) - 4;
            // check it's in a circle from the fae's centre:
            if (isInRange(faeIsoX, faeIsoY, particleIsoX, particleIsoY, 6)) {
                fae.particles.push({ 'depth': findIsoDepth(fae.x, fae.y, fae.z), 'isoX': particleIsoX, 'isoY': particleIsoY, 'alpha': 1 });
            }
        }
    }
}

function moveFae() {
    switch (fae.currentState) {
        case "away":
            moveFaeToDestination(fae.targetX, fae.targetY);
            break;
        case "wait":
            if (isInRange(fae.x, fae.y, hero.x, hero.y, tileW * 3)) {
                // hero is close, move back now
                fae.currentState = "hero";
            }
            break;
        default:
            // "hero":
            fae.angleAroundHero += 4;
            // calc new destination coords:
            var destinationX = hero.x + fae.radiusAroundHero * Math.cos(fae.angleAroundHero * (Math.PI / 180));
            var destinationY = hero.y + fae.radiusAroundHero * Math.sin(fae.angleAroundHero * (Math.PI / 180));
            moveFaeToDestination(destinationX, destinationY);
            break;
    }
}

function moveFaeToDestination(x, y) {
    // check pythagoras distance, and if more than fae speed, move as far on that vector as fae speed, otherwise move to half way to destination so fae decelerates
    var distanceToDestination = getPythagorasDistance(fae.x, fae.y, x, y);
    if (distanceToDestination > fae.speed) {
        // move as far as it can:
        var ratio = fae.speed / distanceToDestination;
        fae.x += ratio * (x - fae.x);
        fae.y += ratio * (y - fae.y);
    } else {
        if (distanceToDestination < 2) {
            // close enough:
            fae.x = x;
            fae.y = y;
            if (fae.currentState == "away") {
                fae.currentState = "wait";
            }
        } else {
            // move half way:
            fae.x += (x - fae.x) / 2;
            fae.y += (y - fae.y) / 2;
        }
    }
    
    var targetZ = hero.z;
    if (targetZ > fae.z) {
        fae.z++;
    } else if (targetZ < fae.z) {
        fae.z--;
    }
    
}
