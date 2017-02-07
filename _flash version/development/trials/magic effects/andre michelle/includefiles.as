
import flash.display.BitmapData;
import flash.filters.BevelFilter;
import flash.filters.DisplacementMapFilter;
import flash.filters.DropShadowFilter;
import flash.geom.ColorTransform;
import flash.geom.Matrix;
import flash.geom.Point;
import flash.geom.Rectangle;

class de.popforge.filter.Glass
{
        //-- properties
        public var distance: Number;
        public var edgeSmooth: Number;
        public var formAlpha: Number;
        public var displace: Number;
       
        //-- sources
        private var form: BitmapData;
        private var back: BitmapData;
       
        //-- geom
        private var origin: Point;
        private var bounds: Rectangle;
        private var identity: Matrix;
        private var translate: Matrix;
       
        //-- ColorTransform
        private var grayMaker: ColorTransform;
        private var blendForm: ColorTransform;
       
        //-- Gradient Filters
        private var hDist: BevelFilter;
        private var vDist: BevelFilter;
       
        //-- effect helpers
        private var d0: BitmapData;
        private var d1: BitmapData;
        private var dd: BitmapData;
        private var grayForm: BitmapData;
       
        //-- displacement
        private var displacement: DisplacementMapFilter;
       
        //-- constructor
        public function Glass( form: BitmapData, back: BitmapData )
        {
                this.form = form;
                this.back = back;
               
                init();
        }
       
        private function init(): Void
        {
                //-- default values
                distance = 3;
                edgeSmooth = 3;
                formAlpha = 0;
                displace = 64;
               
                //-- transform an image to be gray
                grayMaker = new ColorTransform( 0, 0, 0, 1, 0, 0x40, 0x40, 0 );
                blendForm = new ColorTransform();
               
                //-- some default geom properties
                origin = new Point();
                bounds = form.rectangle;
                identity = new Matrix();
                translate = new Matrix();
               
                //-- form as gray color
                grayForm = new BitmapData( form.width, form.height, true, 0x008080 );
               
                //-- displacement image sources
                d0 = new BitmapData( form.width, form.height, true, 0x008080 );
                d1 = new BitmapData( form.width, form.height, true, 0x008080 );
                dd = new BitmapData( form.width, form.height, false, 0x008080 );
               
                //-- use bevelfilter to apply displacement gradient (x, y)
                hDist = new BevelFilter( distance, 180, 0x008000, 100, 0, 100, edgeSmooth, edgeSmooth, 1, 3, 'inner' );
                vDist = new BevelFilter( distance, 270, 0x000080, 100, 0, 100, edgeSmooth, edgeSmooth, 1, 3, 'inner' );
               
                //-- displacementMapFilter
                displacement = new DisplacementMapFilter( dd, origin, 2, 4, -displace, -displace, 'ignore' );
               
                //-- init displacement gradient source
                onFormChanged();
        }
       
        public function onFormChanged(): Void
        {
                //-- copy form and apply gray 'color'
                grayForm.copyPixels( form, bounds, origin );
                grayForm.colorTransform( bounds, grayMaker );
               
                //-- apply displacement gradients
                d0.applyFilter( grayForm, bounds, origin, hDist );
                d1.applyFilter( grayForm, bounds, origin, vDist );
               
                //-- merge gradients
                dd.draw( d0, identity, null, null, null, true );
                dd.draw( d1, identity, null, 'add', null, true );
        }
       
        public function update( output: BitmapData, mapPoint: Point ): Void
        {
                //-- translate mapPoint
                displacement.mapPoint = mapPoint;
               
                //-- copy background to output
                output.copyPixels( back, back.rectangle, origin );
               
                //-- apply displacement
                output.applyFilter( output, back.rectangle, origin, displacement );
               
                //-- blend source form bitmap
                if( formAlpha > 0 )
                {
                        translate.tx = mapPoint.x;
                        translate.ty = mapPoint.y;
                        blendForm.alphaMultiplier = formAlpha;
                        output.draw( form, translate, blendForm, 'multiply' );
                }
        }
}
 
