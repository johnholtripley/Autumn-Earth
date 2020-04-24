  var waves = 10;
  var speed = 0.05;
  var scale = 0.5;
  var ca;
  var c;

  var source;

  var w, h, dw, dh;

  var offset = 0;
  var frame = 0;
  var max_frames = 0;

  function lake() {

      w = c.canvas.width;
      h = c.canvas.height;
      dw = w;
      dh = h;


     //  c.clearRect(0,0,800,450);

    //  var id = source.data;
   var copiedData = source.data.slice();
        var id = new ImageData(copiedData, w, h).data;


      var end = false;

      //c.save();

      // while (!end) {
      // var odd = c.createImageData(dw, dh);
      //    var odd = c.getImageData(0, h, w, h);
      var odd = source;
      var od = source.data;


//   var copiedData2 = source.data.slice();
//        var od = new ImageData(copiedData2, w, h);


      //var pixel = (w*4) * 5;
      var pixel = 0;




      for (var y = 0; y < dh; y++) {
          for (var x = 0; x < dw; x++) {
              // var displacement = (scale * dd[pixel]) | 0;

              var displacement = (scale * 10 * (Math.sin((dh / (y / waves)) + (-offset)))) | 0;

              // john amends:
              var scaleModifier = 0.15;
              var displacement = (scale * 10 * (Math.sin(((y / waves) * scaleModifier) + (-offset)))) | 0;

              var j = ((displacement + y) * w + x + displacement) * 4;

              // horizon flickering fix
              if (j < 0) {
                  pixel += 4;
                  continue;
              }

            
                  od[pixel] = id[j];
                  od[++pixel] = id[++j];
                  od[++pixel] = id[++j];
                  od[++pixel] = id[++j];
                  ++pixel;

          }
      }


 offset += speed;
frame++;



      /*
                      if (offset > speed * (6/speed)) {
                          offset = 0;
                          max_frames = frame - 1;
                          // frames.pop();
                          frame = 0;
                          end = true;
                      } else {
                          offset += speed;
                          frame++;
                      }

      */
//console.log(odd);
      //frames.push(odd);
      c.putImageData(odd, 0, 0);
      //    }

      //c.restore();

postMessage("done");

  }


  self.onmessage = function(e) {

      if (e.data.source) {
          source = e.data.source;

      }

      if (e.data.canvas) {
          ca = e.data.canvas;
          c = ca.getContext('2d');
      }
      lake();

  };