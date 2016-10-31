#Seventh Assignment - Systematic Logo#
I decided to design an system to create logos for the Olympics in Tokyo 2020.
The system is based on two circles, the outer circle and an inner circle. Each
circle is divided into a set number of points.  The outer circle is used as end
points for bezier curves, and the inner circle points are chosen and used as
control points for the curves.  The brush effect is achieved by manually
creating the beizer curves, plotting points along them, extruding the curves
using the normal vector at each point, then scaling the ends of the brush
stroke based on how far they are from the end points of the curve.

The logo and brush stroke paths are given a tiny bit of randomized noise to
create a more manual, brush like look to the shapes.

[img]: https://github.com/jcharry/programming-design-systems-projects/blob/master/seventh-assignment/generative-olympic-logo.png

![][img]

