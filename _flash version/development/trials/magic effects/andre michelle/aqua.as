// Glass Effect Demo
// Author: Mario Klingemann
// http;//www.quasimondo.com
// mario@quasimondo.com


import flash.display.*;
import flash.filters.*;
import flash.geom.*;

var skyBaseMap:BitmapData = BitmapData.loadBitmap ("sky");
var sky:MovieClip = createEmptyMovieClip ("sky", 0);
sky.attachBitmap (skyBaseMap,0);

var logo:MovieClip = attachMovie ("Q", "logo", 1);
logo.cacheAsBitmap = true;
logo._alpha = 70;

var padding:Number = 10;
var m:Matrix = new Matrix (1, 0, 0, 1, padding / 2, padding / 2);
var tempMap = new BitmapData (logo._width + padding, logo._height + padding, true, 0x00808080);
var displaceMap = new BitmapData (logo._width + padding, logo._height + padding, false, 0x808080);
var mergeMap:BitmapData = new BitmapData (tempMap.width, tempMap.height, true, 0x00808080);

var displaceFilter:DisplacementMapFilter;
var blurFilter:BlurFilter = new BlurFilter (2, 2, 2);

var zero:Point = new Point(0,0);

makeGlass ();

var logo2:MovieClip = createEmptyMovieClip ("logo2", 4);
logo2.attachBitmap (mergeMap,0);
logo2.filters = [new DropShadowFilter (4, 45, 0x000000, 2, 8, 8, 0.3, 3, false, false, false)];

var logo3:MovieClip = attachMovie ("q", "logo3", 7);
logo3.blendMode = "add";
logo3.filters = [new BevelFilter (10, 0, 0x000000, 1, 0x000000, 1, 18, 18, 3, 1, "inner"), new BlurFilter (10, 10, 2)];

angle1.addEventListener ("change",this);
angle2.addEventListener ("change",this);
bevel1.addEventListener ("change",this);
smooth1.addEventListener ("change",this);
displace1.addEventListener ("change",this);
displace2.addEventListener ("change",this);
fuzzy1.addEventListener ("change",this);
base1.addEventListener ("change",this);
base2.addEventListener ("change",this);

function makeGlass ():Void
{
	displaceFilter = new DisplacementMapFilter (displaceMap, zero, 1, 2, displace1.value, displace1.value, "wrap");
	var bevel:BevelFilter = new BevelFilter (bevel1.value, angle1.value, 0xffffff, 1, 0x000000, 1, smooth1.value, smooth1.value, 3, 1, "inner");
	logo.filters = [bevel];
	tempMap.fillRect (tempMap.rectangle,0x00808080);
	tempMap.draw (logo,m,new ColorTransform (1, 0, 0, 1, base1.value, 0, 0, 0),"normal",null,true);
	bevel.angle += angle2.value;
	logo.filters = [bevel];
	tempMap.draw (logo,m,new ColorTransform (0, 1, 0, 1, 0, base2.value, 0, 0),"add",null,true);
	tempMap.applyFilter (tempMap,tempMap.rectangle,zero,blurFilter);
	displaceMap.draw (tempMap);
}

function change (evt_obj:Object)
{
	makeGlass ();
}

function onEnterFrame ()
{
	var x:Number = _xmouse;
	var y:Number = _ymouse;
	if (!skyBaseMap.rectangle.contains (_xmouse, _ymouse))
	{
		x = skyBaseMap.rectangle.width / 2;
		y = skyBaseMap.rectangle.height / 2;
	}
	
	logo2._x = Math.round (0.9 * logo2._x + 0.1 * (x - logo._width / 2));
	logo2._y = Math.round (0.9 * logo2._y + 0.1 * (y - logo._height / 2));
	
	logo._x = logo2._x + padding / 2;
	logo._y = logo2._y + padding / 2;
	
	logo3._x = logo2._x + 8;
	logo3._y = logo2._y + 8;
	
	var rect:Rectangle = new Rectangle (logo2._x, logo2._y, logo._width + padding, logo._height + padding);
	mergeMap.copyPixels (skyBaseMap,rect,zero);
	rect.x = rect.y = 0;
	mergeMap.applyFilter (mergeMap,rect,zero,new BlurFilter (fuzzy1.value, fuzzy1.value, 2));
	mergeMap.applyFilter (mergeMap,rect,zero,displaceFilter);
	mergeMap.copyChannel (tempMap,tempMap.rectangle,zero,8,8);
}
