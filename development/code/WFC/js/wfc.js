
"use strict";



var Model = function Model() {};

Model.prototype.FMX = 0;
Model.prototype.FMY = 0;
Model.prototype.FMXxFMY = 0;
Model.prototype.T = 0;
Model.prototype.N = 0;
Model.prototype.initiliazedField = false;
Model.prototype.generationComplete = false;
Model.prototype.wave = null;
Model.prototype.compatible = null;
Model.prototype.weightLogWeights = null;
Model.prototype.sumOfWeights = 0;
Model.prototype.sumOfWeightLogWeights = 0;
Model.prototype.startingEntropy = 0;
Model.prototype.sumsOfOnes = null;
Model.prototype.sumsOfWeights = null;
Model.prototype.sumsOfWeightLogWeights = null;
Model.prototype.entropies = null;
Model.prototype.propagator = null;
Model.prototype.observed = null;
Model.prototype.distribution = null;
Model.prototype.stack = null;
Model.prototype.stackSize = 0;
Model.prototype.DX = [-1, 0, 1, 0];
Model.prototype.DY = [0, 1, 0, -1];
Model.prototype.opposite = [2, 3, 0, 1];
/**
 * @protected
 */

Model.prototype.initialize = function () {
  this.distribution = new Array(this.T);
  this.wave = new Array(this.FMXxFMY);
  this.compatible = new Array(this.FMXxFMY);

  for (var i = 0; i < this.FMXxFMY; i++) {
    this.wave[i] = new Array(this.T);
    this.compatible[i] = new Array(this.T);

    for (var t = 0; t < this.T; t++) {
      this.compatible[i][t] = [0, 0, 0, 0];
    }
  }

  this.weightLogWeights = new Array(this.T);
  this.sumOfWeights = 0;
  this.sumOfWeightLogWeights = 0;

  for (var _t = 0; _t < this.T; _t++) {
    this.weightLogWeights[_t] = this.weights[_t] * Math.log(this.weights[_t]);
    this.sumOfWeights += this.weights[_t];
    this.sumOfWeightLogWeights += this.weightLogWeights[_t];
  }

  this.startingEntropy = Math.log(this.sumOfWeights) - this.sumOfWeightLogWeights / this.sumOfWeights;
  this.sumsOfOnes = new Array(this.FMXxFMY);
  this.sumsOfWeights = new Array(this.FMXxFMY);
  this.sumsOfWeightLogWeights = new Array(this.FMXxFMY);
  this.entropies = new Array(this.FMXxFMY);
  this.stack = new Array(this.FMXxFMY * this.T);
  this.stackSize = 0;
};
/**
 *
 * @param {Function} rng Random number generator function
 *
 * @returns {*}
 *
 * @protected
 */


Model.prototype.observe = function (rng) {
  var min = 1000;
  var argmin = -1;

  for (var i = 0; i < this.FMXxFMY; i++) {
    if (this.onBoundary(i % this.FMX, i / this.FMX | 0)) continue;
    var amount = this.sumsOfOnes[i];
    if (amount === 0) return false;
    var entropy = this.entropies[i];

    if (amount > 1 && entropy <= min) {
      var noise = 0.000001 * rng();

      if (entropy + noise < min) {
        min = entropy + noise;
        argmin = i;
      }
    }
  }

  if (argmin === -1) {
    this.observed = new Array(this.FMXxFMY);

    for (var _i = 0; _i < this.FMXxFMY; _i++) {
      for (var t = 0; t < this.T; t++) {
        if (this.wave[_i][t]) {
          this.observed[_i] = t;
          break;
        }
      }
    }

    return true;
  }

  for (var _t2 = 0; _t2 < this.T; _t2++) {
    this.distribution[_t2] = this.wave[argmin][_t2] ? this.weights[_t2] : 0;
  }

  var r = randomIndice(this.distribution, rng());
  var w = this.wave[argmin];

  for (var _t3 = 0; _t3 < this.T; _t3++) {
    if (w[_t3] !== (_t3 === r)) this.ban(argmin, _t3);
  }

  return null;
};
/**
 * @protected
 */


Model.prototype.propagate = function () {
  while (this.stackSize > 0) {
    var e1 = this.stack[this.stackSize - 1];
    this.stackSize--;
    var i1 = e1[0];
    var x1 = i1 % this.FMX;
    var y1 = i1 / this.FMX | 0;

    for (var d = 0; d < 4; d++) {
      var dx = this.DX[d];
      var dy = this.DY[d];
      var x2 = x1 + dx;
      var y2 = y1 + dy;
      if (this.onBoundary(x2, y2)) continue;
      if (x2 < 0) x2 += this.FMX;else if (x2 >= this.FMX) x2 -= this.FMX;
      if (y2 < 0) y2 += this.FMY;else if (y2 >= this.FMY) y2 -= this.FMY;
      var i2 = x2 + y2 * this.FMX;
      var p = this.propagator[d][e1[1]];
      var compat = this.compatible[i2];

      for (var l = 0; l < p.length; l++) {
        var t2 = p[l];
        var comp = compat[t2];
        comp[d]--;
        if (comp[d] == 0) this.ban(i2, t2);
      }
    }
  }
};
/**
 * Execute a single iteration
 *
 * @param {Function} rng Random number generator function
 *
 * @returns {boolean|null}
 *
 * @protected
 */


Model.prototype.singleIteration = function (rng) {
  var result = this.observe(rng);

  if (result !== null) {
    this.generationComplete = result;
    return !!result;
  }

  this.propagate();
  return null;
};
/**
 * Execute a fixed number of iterations. Stop when the generation is successful or reaches a contradiction.
 *
 * @param {int} [iterations=0] Maximum number of iterations to execute (0 = infinite)
 * @param {Function|null} [rng=Math.random] Random number generator function
 *
 * @returns {boolean} Success
 *
 * @public
 */


Model.prototype.iterate = function (iterations, rng) {
  if (!this.wave) this.initialize();

  if (!this.initiliazedField) {
    this.clear();
  }

  iterations = iterations || 0;
  rng = rng || Math.random;

  for (var i = 0; i < iterations || iterations === 0; i++) {
    var result = this.singleIteration(rng);

    if (result !== null) {
      return !!result;
    }
  }

  return true;
};
/**
 * Execute a complete new generation
 *
 * @param {Function|null} [rng=Math.random] Random number generator function
 *
 * @returns {boolean} Success
 *
 * @public
 */


Model.prototype.generate = function (rng) {
  rng = rng || Math.random;
  if (!this.wave) this.initialize();
  this.clear();

  while (true) {
    var result = this.singleIteration(rng);

    if (result !== null) {
      return !!result;
    }
  }
};
/**
 * Check whether the previous generation completed successfully
 *
 * @returns {boolean}
 *
 * @public
 */


Model.prototype.isGenerationComplete = function () {
  return this.generationComplete;
};
/**
 *
 * @param {int} i
 * @param {int} t
 *
 * @protected
 */


Model.prototype.ban = function (i, t) {
  var comp = this.compatible[i][t];

  for (var d = 0; d < 4; d++) {
    comp[d] = 0;
  }

  this.wave[i][t] = false;
  this.stack[this.stackSize] = [i, t];
  this.stackSize++;
  this.sumsOfOnes[i] -= 1;
  this.sumsOfWeights[i] -= this.weights[t];
  this.sumsOfWeightLogWeights[i] -= this.weightLogWeights[t];
  var sum = this.sumsOfWeights[i];
  this.entropies[i] = Math.log(sum) - this.sumsOfWeightLogWeights[i] / sum;
};
/**
 * Clear the internal state to start a new generation
 *
 * @public
 */


Model.prototype.clear = function () {
  for (var i = 0; i < this.FMXxFMY; i++) {
    for (var t = 0; t < this.T; t++) {
      this.wave[i][t] = true;

      for (var d = 0; d < 4; d++) {
        this.compatible[i][t][d] = this.propagator[this.opposite[d]][t].length;
      }
    }

    this.sumsOfOnes[i] = this.weights.length;
    this.sumsOfWeights[i] = this.sumOfWeights;
    this.sumsOfWeightLogWeights[i] = this.sumOfWeightLogWeights;
    this.entropies[i] = this.startingEntropy;
  }

  this.initiliazedField = true;
  this.generationComplete = false;
};


/**
 *
 * @param {Uint8Array|Uint8ClampedArray} data The RGBA data of the source image
 * @param {int} dataWidth The width of the source image
 * @param {int} dataHeight The height of the source image
 * @param {int} N Size of the patterns
 * @param {int} width The width of the generation
 * @param {int} height The height of the generation
 * @param {boolean} periodicInput Whether the source image is to be considered as periodic / as a repeatable texture
 * @param {boolean} periodicOutput Whether the generation should be periodic / a repeatable texture
 * @param {int} symmetry Allowed symmetries from 1 (no symmetry) to 8 (all mirrored / rotated variations)
 * @param {int} [ground=0] Id of the specific pattern to use as the bottom of the generation ( see https://github.com/mxgmn/WaveFunctionCollapse/issues/3#issuecomment-250995366 )
 *
 * @constructor
 */


var OverlappingModel = function OverlappingModel(data, dataWidth, dataHeight, N, width, height, periodicInput, periodicOutput, symmetry, ground) {
  ground = ground || 0;
  this.N = N;
  this.FMX = width;
  this.FMY = height;
  this.FMXxFMY = width * height;
  this.periodic = periodicOutput;
  var SMX = dataWidth;
  var SMY = dataHeight;
  var sample = new Array(SMX);

  for (var i = 0; i < SMX; i++) {
    sample[i] = new Array(dataHeight);
  }

  this.colors = [];
  var colorMap = {};

  for (var y = 0; y < dataHeight; y++) {
    for (var x = 0; x < dataWidth; x++) {
      var indexPixel = (y * dataWidth + x) * 4;
      var color = [data[indexPixel], data[indexPixel + 1], data[indexPixel + 2], data[indexPixel + 3]];
      var colorMapIndex = color.join('-');

      if (!colorMap.hasOwnProperty(colorMapIndex)) {
        colorMap[colorMapIndex] = this.colors.length;
        this.colors.push(color);
      }

      sample[x][y] = colorMap[colorMapIndex];
    }
  }

  var C = this.colors.length;
  var W = Math.pow(C, N * N);

  var pattern = function pattern(f) {
    var result = new Array(N * N);

    for (var _y = 0; _y < N; _y++) {
      for (var _x = 0; _x < N; _x++) {
        result[_x + _y * N] = f(_x, _y);
      }
    }

    return result;
  };

  var patternFromSample = function patternFromSample(x, y) {
    return pattern(function (dx, dy) {
      return sample[(x + dx) % dataWidth][(y + dy) % dataHeight];
    });
  };

  var rotate = function rotate(p) {
    return pattern(function (x, y) {
      return p[N - 1 - y + x * N];
    });
  };

  var reflect = function reflect(p) {
    return pattern(function (x, y) {
      return p[N - 1 - x + y * N];
    });
  };

  var index = function index(p) {
    var result = 0;
    var power = 1;

    for (var _i = 0; _i < p.length; _i++) {
      result += p[p.length - 1 - _i] * power;
      power *= C;
    }

    return result;
  };

  var patternFromIndex = function patternFromIndex(ind) {
    var residue = ind;
    var power = W;
    var result = new Array(N * N);

    for (var _i2 = 0; _i2 < result.length; _i2++) {
      power /= C;
      var count = 0;

      while (residue >= power) {
        residue -= power;
        count++;
      }

      result[_i2] = count;
    }

    return result;
  };

  var weights = {};
  var weightsKeys = []; // Object.keys won't preserve the order of creation, so we store them separately in an array

  for (var _y2 = 0; _y2 < (periodicInput ? dataHeight : dataHeight - N + 1); _y2++) {
    for (var _x2 = 0; _x2 < (periodicInput ? dataWidth : dataWidth - N + 1); _x2++) {
      var ps = new Array(8);
      ps[0] = patternFromSample(_x2, _y2);
      ps[1] = reflect(ps[0]);
      ps[2] = rotate(ps[0]);
      ps[3] = reflect(ps[2]);
      ps[4] = rotate(ps[2]);
      ps[5] = reflect(ps[4]);
      ps[6] = rotate(ps[4]);
      ps[7] = reflect(ps[6]);

      for (var k = 0; k < symmetry; k++) {
        var ind = index(ps[k]);

        if (!!weights[ind]) {
          weights[ind]++;
        } else {
          weightsKeys.push(ind);
          weights[ind] = 1;
        }
      }
    }
  }

  this.T = weightsKeys.length;
  this.ground = (ground + this.T) % this.T;
  this.patterns = new Array(this.T);
  this.weights = new Array(this.T);

  for (var _i3 = 0; _i3 < this.T; _i3++) {
    var w = parseInt(weightsKeys[_i3], 10);
    this.patterns[_i3] = patternFromIndex(w);
    this.weights[_i3] = weights[w];
  }

  var agrees = function agrees(p1, p2, dx, dy) {
    var xmin = dx < 0 ? 0 : dx;
    var xmax = dx < 0 ? dx + N : N;
    var ymin = dy < 0 ? 0 : dy;
    var ymax = dy < 0 ? dy + N : N;

    for (var _y3 = ymin; _y3 < ymax; _y3++) {
      for (var _x3 = xmin; _x3 < xmax; _x3++) {
        if (p1[_x3 + N * _y3] != p2[_x3 - dx + N * (_y3 - dy)]) {
          return false;
        }
      }
    }

    return true;
  };

  this.propagator = new Array(4);

  for (var d = 0; d < 4; d++) {
    this.propagator[d] = new Array(this.T);

    for (var t = 0; t < this.T; t++) {
      var list = [];

      for (var t2 = 0; t2 < this.T; t2++) {
        if (agrees(this.patterns[t], this.patterns[t2], this.DX[d], this.DY[d])) {
          list.push(t2);
        }
      }

      this.propagator[d][t] = list;
    }
  }
};

OverlappingModel.prototype = Object.create(Model.prototype);
OverlappingModel.prototype.constructor = OverlappingModel;
/**
 * @param {int} x
 * @param {int} y
 *
 * @returns {boolean}
 *
 * @protected
 */

OverlappingModel.prototype.onBoundary = function (x, y) {
  return !this.periodic && (x + this.N > this.FMX || y + this.N > this.FMY || x < 0 || y < 0);
};
/**
 * Clear the internal state
 *
 * @protected
 */


OverlappingModel.prototype.clear = function () {
  Model.prototype.clear.call(this);

  if (this.ground !== 0) {
    for (var x = 0; x < this.FMX; x++) {
      for (var t = 0; t < this.T; t++) {
        if (t !== this.ground) {
          this.ban(x + (this.FMY - 1) * this.FMX, t);
        }
      }

      for (var y = 0; y < this.FMY - 1; y++) {
        this.ban(x + y * this.FMX, this.ground);
      }
    }

    this.propagate();
  }
};
/**
 * Retrieve the RGBA data
 *
 * @param {Array|Uint8Array|Uint8ClampedArray} [array] Array to write the RGBA data into (must already be set to the correct size), if not set a new Uint8Array will be created and returned
 *
 * @returns {Array|Uint8Array|Uint8ClampedArray} RGBA data
 *
 * @public
 */


OverlappingModel.prototype.graphics = function (array) {
  array = array || new Uint8Array(this.FMXxFMY * 4);

  if (this.isGenerationComplete()) {
    this.graphicsComplete(array);
  } else {
    this.graphicsIncomplete(array);
  }

  return array;
};
/**
 * Set the RGBA data for a complete generation in a given array
 *
 * @param {Array|Uint8Array|Uint8ClampedArray} array Array to write the RGBA data into
 *
 * @protected
 */


OverlappingModel.prototype.graphicsComplete = function (array) {
  for (var y = 0; y < this.FMY; y++) {
    var dy = y < this.FMY - this.N + 1 ? 0 : this.N - 1;

    for (var x = 0; x < this.FMX; x++) {
      var dx = x < this.FMX - this.N + 1 ? 0 : this.N - 1;
      var pixelIndex = (y * this.FMX + x) * 4;
      var color = this.colors[this.patterns[this.observed[x - dx + (y - dy) * this.FMX]][dx + dy * this.N]];
      array[pixelIndex] = color[0];
      array[pixelIndex + 1] = color[1];
      array[pixelIndex + 2] = color[2];
      array[pixelIndex + 3] = color[3];
    }
  }
};
/**
 * Set the RGBA data for an incomplete generation in a given array
 *
 * @param {Array|Uint8Array|Uint8ClampedArray} array Array to write the RGBA data into
 *
 * @protected
 */


OverlappingModel.prototype.graphicsIncomplete = function (array) {
  for (var i = 0; i < this.FMXxFMY; i++) {
    var x = i % this.FMX;
    var y = i / this.FMX | 0;
    var contributors = 0;
    var r = 0;
    var g = 0;
    var b = 0;
    var a = 0;

    for (var dy = 0; dy < this.N; dy++) {
      for (var dx = 0; dx < this.N; dx++) {
        var sx = x - dx;
        if (sx < 0) sx += this.FMX;
        var sy = y - dy;
        if (sy < 0) sy += this.FMY;
        if (this.onBoundary(sx, sy)) continue;
        var s = sx + sy * this.FMX;

        for (var t = 0; t < this.T; t++) {
          if (this.wave[s][t]) {
            contributors++;
            var color = this.colors[this.patterns[t][dx + dy * this.N]];
            r += color[0];
            g += color[1];
            b += color[2];
            a += color[3];
          }
        }
      }
    }

    var pixelIndex = i * 4;
    array[pixelIndex] = r / contributors;
    array[pixelIndex + 1] = g / contributors;
    array[pixelIndex + 2] = b / contributors;
    array[pixelIndex + 3] = a / contributors;
  }
};


/**
 *
 * @param {number[]} array
 * @param {float} r
 */

function randomIndice(array, r) {
  var sum = 0;
  var x = 0;
  var i = 0;

  for (; i < array.length; i++) {
    sum += array[i];
  }

  i = 0;
  r *= sum;

  while (r && i < array.length) {
    x += array[i];

    if (r <= x) {
      return i;
    }

    i++;
  }

  return 0;
}


