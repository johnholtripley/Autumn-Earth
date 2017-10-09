<?php

// -----------------------------------------
// NOT MINE
http: //codetalk.code-kobold.de/drawing-arrows-with-the-gd-library-in-php/
class GDArrow
{

    /**
     * The referenced canvas
     */
    public $image;

    /**
     * Arrow color
     */
    public $color;

    /**
     * X-Coordinate of arrow's starting point
     */
    public $x1;

    /**
     * Y-Coordinate of arrow's starting point
     */
    public $y1;

    /**
     * X-Coordinate of arrow's endpoint
     */
    public $x2;

    /**
     * Y-Coordinate of arrow's starting point
     */
    public $y2;

    /**
     * Arm angle of the arrowhead
     */
    public $angle;

    /**
     * Length of the arrowhead
     */
    public $radius;

    /**
     * The constructor
     */
    public function __construct()
    {}

    /**
     * Draws the arrow according the given parameters
     */
    public function drawGDArrow()
    {

        $l_m      = null;
        $l_x1     = null;
        $l_y1     = null;
        $l_x2     = null;
        $l_y2     = null;
        $l_angle1 = null;
        $l_angle2 = null;
        $l_cos1   = null;
        $l_sin1   = null;

        // Draws the arrow's line
        Imageline($this->image, $this->x1, $this->y1, $this->x2, $this->y2, $this->color);

        // Gradient infinite?
        if ($this->x2 == $this->x1) {

            $l_m = false;

            if ($this->y1 < $this->y2) {

                $l_x1 = $this->x2 - $this->radius * sin(deg2rad($this->angle));
                $l_y1 = $this->y2 - $this->radius * cos(deg2rad($this->angle));
                $l_x2 = $this->x2 + $this->radius * sin(deg2rad($this->angle));
                $l_y2 = $this->y2 - $this->radius * cos(deg2rad($this->angle));

            } else {

                $l_x1 = $this->x2 - $this->radius * sin(deg2rad($this->angle));
                $l_y1 = $this->y2 + $this->radius * cos(deg2rad($this->angle));
                $l_x2 = $this->x2 + $this->radius * sin(deg2rad($this->angle));
                $l_y2 = $this->y2 + $this->radius * cos(deg2rad($this->angle));

            } // endelse

        } // endif $this -> x2 == $this -> x1

        // Gradient = 0
        elseif ($this->y2 == $this->y1) {

            $l_m = 0;

            if ($this->x1 < $this->x2) {

                $l_x1 = $this->x2 - $this->radius * cos(deg2rad($this->angle));
                $l_y1 = $this->y2 - $this->radius * sin(deg2rad($this->angle));
                $l_x2 = $this->x2 - $this->radius * cos(deg2rad($this->angle));
                $l_y2 = $this->y2 + $this->radius * sin(deg2rad($this->angle));

            } else {

                $l_x1 = $this->x2 + $this->radius * cos(deg2rad($this->angle));
                $l_y1 = $this->y2 + $this->radius * sin(deg2rad($this->angle));
                $l_x2 = $this->x2 + $this->radius * cos(deg2rad($this->angle));
                $l_y2 = $this->y2 - $this->radius * sin(deg2rad($this->angle));

            }

        } // endif $this -> y2 == $this -> y1

        // Gradient positive?
        elseif ($this->x2 > $this->x1) {

            // Calculate gradient
            $l_m = (($this->y2 - $this->y1) / ($this->x2 - $this->x1));

            // Convert gradient (= Arc tangent(m)) from radian to degree
            $l_alpha = rad2deg(atan($l_m));

            // Right arm angle = gradient + 180 + arm angle
            $l_angle1 = $l_alpha + $this->angle + 180;
            // Left arm angle = gradient + 180 - arm angle
            $l_angle2 = $l_alpha - $this->angle + 180;

            // Right arm angle of arrowhead
            // Abscissa = cos(gradient + 180 + arm angle) * radius
            $l_cos1 = $this->radius * cos(deg2rad($l_angle1));
            $l_x1   = $this->x2 + $l_cos1;

            // Ordinate = sin(gradient + 180 + arm angle) * radius
            $l_sin1 = $this->radius * sin(deg2rad($l_angle1));
            $l_y1   = $this->y2 + $l_sin1;

            // Left arm angle of arrowhead
            $RCos2 = $this->radius * cos(deg2rad($l_angle2));
            $RSin2 = $this->radius * sin(deg2rad($l_angle2));

            $l_x2 = $this->x2 + $RCos2;
            $l_y2 = $this->y2 + $RSin2;

        } // endif $this -> x2 > $this -> x1

        // Gradient negative?
        elseif ($this->x2 < $this->x1) {

            $this->angle = 90 - $this->angle;

            // Calculate gradient
            $l_m = (($this->y2 - $this->y1) / ($this->x2 - $this->x1));

            // Convert gradient (= Arc tangent(m)) from radian to degree
            $l_alpha = rad2deg(atan($l_m));

            // Right arm angle = gradient + 180 + arm angle
            $l_angle1 = $l_alpha + $this->angle + 180;
            // Left arm angle = gradient + 180 - arm angle
            $l_angle2 = $l_alpha - $this->angle + 180;

            // Right arm angle of arrowhead
            // Abscissa = cos(gradient + 180 + arm angle) * radius
            $l_cos1 = $this->radius * cos(deg2rad($l_angle1));

            // Ordinate = sin(gradient + 180 + arm angle) * radius
            $l_sin1 = $this->radius * sin(deg2rad($l_angle1));

            // Left arm angle of arrowhead
            $RCos2 = $this->radius * cos(deg2rad($l_angle2));
            $RSin2 = $this->radius * sin(deg2rad($l_angle2));

            $l_x1 = $this->x2 - $l_sin1;
            $l_y1 = $this->y2 + $l_cos1;

            $l_x2 = $this->x2 + $RSin2;
            $l_y2 = $this->y2 - $RCos2;

        } // endif $this -> x2 < $this -> x1

        Imageline($this->image, $l_x1, $l_y1, $this->x2, $this->y2, $this->color);
        Imageline($this->image, $l_x2, $l_y2, $this->x2, $this->y2, $this->color);

    } // drawGDArrow()

} // class GDArrow

// -----------------------------------------

?>