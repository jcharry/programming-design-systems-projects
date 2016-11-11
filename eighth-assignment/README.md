#Eight Assignment - Randomization#
Recreating this Sol Lewitt Wall Drawing
[piece]: http://hyperallergic.com/wp-content/uploads/2013/09/GALLERIES6-articleLarge1.jpg
![][piece]

##Implementation##
###Polygons###
I first attempted to recreate the polygons by drawing random lines, saving
their state, then using those to draw polygons off those lines, but it quickly
became very difficult.  Turns out packing polygons tightly together is a very
difficult problem.  In a moment of clarity, it struck me that the wall drawing
is very similar to a voronoi pattern.  So instead of packing polygons myself,
I could just find a voronoi implementation and use that to draw the edges.
After playing with voronoi for a while, I stumbled upon an even more accurate
representation - the Delaunay triangulation pattern.

This little library proved simple, and immensely useful:
[sokeroner's delaunay-traingulation](https://github.com/sokeroner/Delaunay-Triangulation)

###The bin packing problem###
In trying to figure out how to replicate the irregular grid in Sol Lewitt's
piece, I stumbled across bin packing.  Essentially it's concerned with how to
efficiently pack rectangles in a box.  Exaclty what I needed.
And another little library to the rescue:
[bin packing by jakesgordon](https://github.com/jakesgordon/bin-packing)


#Output#
[output]: https://github.com/jcharry/programming-design-systems-projects/blob/master/eighth-assignment/imgs/walldrawing_small.png
![][output]



