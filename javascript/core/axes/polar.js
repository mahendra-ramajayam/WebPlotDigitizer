/*
	WebPlotDigitizer - http://arohatgi.info/WebPlotdigitizer

	Copyright 2010-2013 Ankit Rohatgi <ankitrohatgi@hotmail.com>

	This file is part of WebPlotDigitizer.

    WebPlotDIgitizer is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    WebPlotDigitizer is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with WebPlotDigitizer.  If not, see <http://www.gnu.org/licenses/>.


*/

var wpd = wpd || {};

wpd.PolarAxes = (function () {
    var AxesObj = function () {
        var isCalibrated = false,
            isDegrees = false,
            isClockwise = false,

            x0, y0, x1, y1, x2, y2, r1, theta1, r2, theta2,
            dist10, dist20, dist12, phi0, alpha0;

            processCalibration = function(cal, is_degrees, is_clockwise) {  
                var cp0 = cal.getPoint(0),
                    cp1 = cal.getPoint(1),
                    cp2 = cal.getPoint(2);
                x0 = cp0.px;
                y0 = cp0.py;
                x1 = cp1.px;
                y1 = cp1.py;
                x2 = cp2.px;
                y2 = cp2.py;

                r1 = cp1.dx;
                theta1 = cp1.dy;
                
                r2 = cp2.dx;
                theta2 = cp2.dy;

                isDegrees = is_degrees;
                isClockwise = is_clockwise;
                
                if (isDegrees === true) {// if degrees
    		        theta1 = (Math.PI/180.0)*theta1;
        			theta2 = (Math.PI/180.0)*theta2;
		        }
		    			    
		        // Distance between 1 and 0.
		        dist10 = Math.sqrt((x1-x0)*(x1-x0) + (y1-y0)*(y1-y0)); 
		    
		        // Distance between 2 and 0
		        dist20 = Math.sqrt((x2-x0)*(x2-x0) + (y2-y0)*(y2-y0)); 
		    
		        // Radial Distance between 1 and 2.
		        dist12 = dist20 - dist10;
		    
		        phi0 = wpd.taninverse(-(y1-y0),x1-x0);
		    
		        alpha0 = phi0 - theta1;
                
                return true;
            };

        this.isCalibrated = function() {
            return isCalibrated;
        };

        this.calibrate = function (calib, is_degrees, is_clockwise) {
            isCalibrated = processCalibration(calib, is_degrees, is_clockwise);
            return isCalibrated;
        };

        this.pixelToData = function(pxi, pyi) {
            var data = [],
                rp,
                thetap;

            xp = parseFloat(pxi);
            yp = parseFloat(py1);

            rp = ((r2-r1)/dist12)*(Math.sqrt((xp-x0)*(xp-x0)+(yp-y0)*(yp-y0))-dist10) + r1;
			
			thetap = wpd.taninverse(-(yp-y0),xp-x0) - alpha0;
			
		    if(isDegrees == true) {
		        thetap = 180.0*thetap/Math.PI;
            }

            data[0] = rp;
            data[1] = thetap;

            return data;
        };

        this.dataToPixel = function(r, theta) {
            return {
                x: 0,
                y: 0
            };
        };
    };

    AxesObj.prototype.numCalibrationPointsRequired = function() {
        return 3;
    };

    AxesObj.prototype.getDimensions = function() {
        return 2;
    };

    return AxesObj;
})();
