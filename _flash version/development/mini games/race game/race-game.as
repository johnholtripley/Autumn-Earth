function gameLoop() {
    if (raceStarted) {
        if (!raceFinished) {
            if (Key.isDown(keymoveup)) {
                if (currentSpeed < topSpeed) {
                    currentSpeed = currentSpeed + 1 / playersWeight;
                }
            }
            if (Key.isDown(keymovedown)) {
                if (currentSpeed > 0) {
                    currentSpeed = currentSpeed - 1 / playersWeight;
                }
            }
            if (currentSpeed > nonTiringSpeed) {
                staminaRemaining = staminaRemaining - (currentSpeed - nonTiringSpeed);
            }
            distanceTravelled = distanceTravelled + currentSpeed;
            if (staminaRemaining <= 0) {
                currentSpeed = currentSpeed - 2;
            }
            if (currentSpeed < 0) {
                currentSpeed = 0;
            }
            playersCharacter._y = 500 - distanceTravelled / 2;
            if (distanceTravelled > raceDistance) {
                raceFinished = true;
                trace("player won");
            }
            var _loc2_ = 0;
            while (_loc2_ < numberOfOpponents) {
                var _loc5_ = this["opponent" + _loc2_].currentSpeed + 1 / this["opponent" + _loc2_].playersWeight;
                var _loc12_ = Math.ceil((raceDistance - this["opponent" + _loc2_].distanceTravelled) / _loc5_);
                var _loc13_ = Math.ceil(_loc5_ - this["opponent" + _loc2_].nonTiringSpeed);
                var _loc11_ = Math.ceil(_loc13_ * _loc12_);
                var _loc4_ = this["opponent" + _loc2_].currentSpeed;
                switch (this["opponent" + _loc2_].behaviour) {
                    case "fastest":
                        if (this["opponent" + _loc2_].currentSpeed < this["opponent" + _loc2_].nonTiringSpeed) {
                            _loc4_ = _loc4_ + 1 / this["opponent" + _loc2_].playersWeight;
                        } else if (this["opponent" + _loc2_].staminaRemaining > _loc11_ && _loc5_ <= this["opponent" + _loc2_].topSpeed) {
                            _loc4_ = _loc5_;
                        }
                        break;
                    case "faststart":
                        if (this["opponent" + _loc2_].okToFastStart) {
                            var _loc7_ = this["opponent" + _loc2_].currentSpeed;
                            if (this["opponent" + _loc2_].currentSpeed < this["opponent" + _loc2_].topSpeed) {
                                _loc7_ = _loc7_ + 1 / this["opponent" + _loc2_].playersWeight;
                            }
                            if (_loc7_ > this["opponent" + _loc2_].topSpeed) {
                                _loc7_ = this["opponent" + _loc2_].topSpeed;
                            }
                            if (_loc7_ > this["opponent" + _loc2_].nonTiringSpeed) {
                                var _loc10_ = _loc7_ - this["opponent" + _loc2_].nonTiringSpeed;
                            } else {
                                _loc10_ = 0;
                            }
                            var _loc9_ = this["opponent" + _loc2_].staminaRemaining - _loc10_;
                            if (_loc9_ - this["opponent" + _loc2_].staminaNeededToSlow <= 0) {
                                _loc4_ = _loc4_ - 1 / this["opponent" + _loc2_].playersWeight;
                                this["opponent" + _loc2_].okToFastStart = false;
                            } else {
                                _loc4_ = _loc4_ + 1 / this["opponent" + _loc2_].playersWeight;
                            }
                        } else if (this["opponent" + _loc2_].currentSpeed > this["opponent" + _loc2_].nonTiringSpeed) {
                            _loc4_ = _loc4_ - 1 / this["opponent" + _loc2_].playersWeight;
                        }
                        break;
                    default:
                        if (this["opponent" + _loc2_].currentSpeed < this["opponent" + _loc2_].nonTiringSpeed) {
                            _loc4_ = _loc4_ + 1 / this["opponent" + _loc2_].playersWeight;
                            break;
                        }
                }
                if (this["opponent" + _loc2_].okToSprint) {
                    _loc4_ = _loc5_;
                } else {
                    var _loc6_ = this["opponent" + _loc2_].staminaRemaining;
                    var _loc3_ = this["opponent" + _loc2_].currentSpeed;
                    var _loc8_ = this["opponent" + _loc2_].distanceTravelled;
                    do {
                        _loc3_ = _loc3_ + 1 / this["opponent" + _loc2_].playersWeight;
                        if (_loc3_ > this["opponent" + _loc2_].topSpeed) {
                            _loc3_ = this["opponent" + _loc2_].topSpeed;
                        }
                        if (_loc3_ > this["opponent" + _loc2_].nonTiringSpeed) {
                            _loc6_ = _loc6_ - (_loc3_ - this["opponent" + _loc2_].nonTiringSpeed);
                        }
                        if (_loc6_ <= 0) {
                            _loc3_ = _loc3_ - 2;
                        }
                        _loc8_ = _loc8_ + _loc3_;
                    }
                    while (_loc6_ > 0);

                    if (_loc8_ > raceDistance) {
                        _loc4_ = _loc5_;
                        this["opponent" + _loc2_].okToSprint = true;
                    }
                }
                this["opponent" + _loc2_].currentSpeed = _loc4_;
                if (this["opponent" + _loc2_].currentSpeed > this["opponent" + _loc2_].topSpeed) {
                    this["opponent" + _loc2_].currentSpeed = this["opponent" + _loc2_].topSpeed;
                }
                if (this["opponent" + _loc2_].currentSpeed > this["opponent" + _loc2_].nonTiringSpeed) {
                    this["opponent" + _loc2_].staminaRemaining = this["opponent" + _loc2_].staminaRemaining - (this["opponent" + _loc2_].currentSpeed - this["opponent" + _loc2_].nonTiringSpeed);
                }
                if (this["opponent" + _loc2_].staminaRemaining <= 0) {
                    this["opponent" + _loc2_].currentSpeed = this["opponent" + _loc2_].currentSpeed - 2;
                }
                if (this["opponent" + _loc2_].currentSpeed < 0) {
                    this["opponent" + _loc2_].currentSpeed = 0;
                }
                this["opponent" + _loc2_].distanceTravelled = this["opponent" + _loc2_].distanceTravelled + this["opponent" + _loc2_].currentSpeed;
                this["opponent" + _loc2_]._y = 500 - this["opponent" + _loc2_].distanceTravelled / 2;
                if (this["opponent" + _loc2_].distanceTravelled > raceDistance) {
                    raceFinished = true;
                    trace("opponent won");
                }
                this["staminaOpponent" + _loc2_]._height = this["opponent" + _loc2_].staminaRemaining * 2;
                _loc2_ = _loc2_ + 1;
            }
            staminaDisplay._height = staminaRemaining * 2;
        }
    }
}
raceFinished = false;
raceStarted = false;
raceDistance = 800;
topSpeed = 20;
staminaRemaining = 200;
currentSpeed = 0;
nonTiringSpeed = topSpeed / 2;
distanceTravelled = 0;
playersWeight = 1;
playersCharacter._y = 500 - distanceTravelled / 2;
staminaDisplay._height = staminaRemaining * 2;
numberOfOpponents = 3;
staminaDisplay._y = 550;
staminaDisplay._x = 400;
var i = 0;
while (i < numberOfOpponents) {
    this.attachMovie("opponent", "opponent" + i, 50 + i);
    this.attachMovie("staminaDisplay", "staminaOpponent" + i, 1000 + i);
    this["staminaOpponent" + i]._x = 430 + i * 30;
    this["staminaOpponent" + i]._y = 550;
    this["opponent" + i].topSpeed = 20;
    this["opponent" + i].staminaRemaining = 200;
    this["staminaOpponent" + i]._height = this["opponent" + i].staminaRemaining * 2;
    this["opponent" + i].currentSpeed = 0;
    this["opponent" + i].okToSprint = false;
    this["opponent" + i].nonTiringSpeed = this["opponent" + i].topSpeed / 2;
    this["opponent" + i].distanceTravelled = 0;
    this["opponent" + i].playersWeight = 1;
    this["opponent" + i].okToFastStart = false;
    switch (i) {
        case 0:
            this["opponent" + i].behaviour = "fastest";
            break;
        case 1:
            this["opponent" + i].behaviour = "faststart";
            this["opponent" + i].okToFastStart = true;
            var tempSpeed = this["opponent" + i].topSpeed;
            var tempStaminaUsed = 0;
            do {
                tempSpeed = tempSpeed - 1 / this["opponent" + i].playersWeight;
                tempStaminaUsed = tempStaminaUsed + (tempSpeed - this["opponent" + i].nonTiringSpeed);
            }
            while (tempSpeed > this["opponent" + i].nonTiringSpeed);

            this["opponent" + i].staminaNeededToSlow = tempStaminaUsed;
    }
    this["opponent" + i]._x = 140 + 40 * i;
    this["opponent" + i]._y = 500 - this["opponent" + i].distanceTravelled / 2;
    i++;
}
keymoveleft = 37;
keymoveup = 38;
keymoveright = 39;
keymovedown = 40;
