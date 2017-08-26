//NOTE: should work on everything short of oddly placed planes (i.e. planes that are in the middle of nowhere, and are never closed by a plane in the opposite direction

import System.Collections.Generic; 

//these are the only variables you have to assign in the script
var rigid : Rigidbody;
var coll : CapsuleCollider;
var trans : Transform;

//all values based on 2.0m player
//later I'm going to need to add a player height variable, for the sake of the ledge grabbing feature
private var h : Vector3; //this is at the top of the rounded capsule's "feet"
h = Vector3(0,coll.radius - coll.height/2 - 0.05,0); //when the foot's collisions should start being handled by mantle
private var height : Vector3 = Vector3(0,3.15,0); // the distance between "h" and the player's imaginary outstretched arm + the smallest space possible for occupation

class SortLedge implements IComparer.<float>
	{
    function Compare(o : float, t : float) //o == one, t == two
    	{            
        if (o < t) return -1;
        if (o > t) return 1;
        return 0;
    	}   
	}

var alpha : RaycastHit[]; //rayCastAll going up
var omega : RaycastHit[]; //rayCastAll going down
var i : int; //just a number for for-loops
var j : int; //just a number for for-loops (specifically k-values in for loops)
var free : boolean; //a boolean for red/blue line rendering and later for determining if a player can mantle/vault
	
var d : float[]; //distances
var s : float[]; //clone of distances
var n : Vector3[]; //normals
var p : Vector3[]; //points
var k : int[]; //how many collisions would an infinitessimal point at this location "feel"

var length : int; //Tested: there shouldn't be any problems with default "1"-length arrays being returned

var o : Vector3;  //the first position, used for drawing the line in Debug
var t : Vector3;  //second position

var v1 : int; //how many collisions an infinitessimal point would encounter if placed at "o"
var v2 : int; //how many collisions an infinitessimal point would encounter if placed at "t"

var u : float; //the distance upwards

var g : int;

function FixedUpdate ()
	{
	var n1 : Vector3;
	n1 = -trans.forward;
	
	var r : RaycastHit;  //ray
	var dist : float;
	
	Physics.Raycast(rigid.position + h, Vector3.up, r, height.y, (1 << 0)); //raycast upward to see how far away the ceiling is
	if(r.normal != Vector3.zero) u = r.distance - 0.01; //if the raycast hit something, there's a ceiling, take the distance and subtract a small segment
	else u = height.y; //otherwise the total distance is going to be a constant
	
	r.normal = Vector3.zero;
	
	Physics.CapsuleCast(rigid.position + h, rigid.position + h + u*Vector3.up, 0, n1,r,0.6,(1 << 0)); //THIS IS A LINESWEEP, NOT A CAPSULECAST (the radius is zero!)
	if(r.normal == Vector3.zero) 
		{
		r.normal = n1; //this prevents errors
		dist = 0.6;
		}
	else dist = r.distance + 0.005;
	
	if(r.normal.y > 0.05 || r.normal.y < -0.05) r.normal = n1; 
	
	g = 1;
	Check(rigid.position + Vector3(0,coll.radius - coll.height/2,0),
		  rigid.position + h - n1*dist);
	g = k[length-1];
	Check(rigid.position + h - n1*dist,
		  rigid.position + h - n1*dist + u*Vector3.up);
	}

function Check (o : Vector3,e : Vector3)
	{
	var r : RaycastHit;  //ray
	var f : float; //distance
	var w : Vector3; //direction
	
	f = Vector3.Distance(o,e);
	
	w = (e-o)/u;
	
	//This is where important stuff starts happening...
	alpha = Physics.RaycastAll(o, w,f,(1 << 0)); //get all collisions from min point going upwards
	omega = Physics.RaycastAll(e,-w,f,(1 << 0)); //get all collisions from max point going downwards
	
	length = alpha.Length + alpha.Length + omega.Length + omega.Length + 2; //the lengths are added twice because the collision point is logged as well as
	//a point barely outside of the collision, this makes the calculations easier later
	
	d = new float[length]; //distances
	s = new float[length]; //copy of distances
	n = new Vector3[length]; //normals
	p = new Vector3[length]; //points/positions/locations of raycastHits
	k = new int[length]; //how many collisions are happening at that point
	
	d[0] = 0.0; //the very first position will have a distance of zero (sort of common sense, start at zero, can't explain it any other way)
	n[0] = Vector3.zero; //the first normal isn't actually up, this normal doesn't matter (not used in calculations)
	p[0] = o; //the position starting near the feet of the player
	k[0] = g;
	if(k[0] > 0) k[0] = 0; //this is for the very first case.  We know the player is inside of a sphere, so the player is a depth of "1"
	
	//
	
	d[length-1] = f; //the end point will have travelled the maximum distance (u)
	n[length-1] = Vector3.zero; //doesn't matter, but the raycast goes down from here, so I just used down
	p[length-1] = e; //the max point, it's the distance the player can reach plus the minimum space (height) into which the player can fit
	
	i = 1;
	
	for(r in alpha) //start loading data from alpha into our carefully constructed arrays
		{
		d[i] = r.distance; //these values should be exactly what you would expect
		n[i] = r.normal;
		p[i] = r.point;
		d[i+1] = d[i] - 0.0001; //minus below (useful for sorting) // this is where the "length = alpha.Length + alpha.Length..." comes in...
		n[i+1] = Vector3.zero; //basically, I'm saying that the position has no normal n[i+1] = Vector3.zero, therefore it will be ignored by "k" calculations
		p[i+1] = p[i] - 0.0001*w; //the point has to be shifted downward (since alpha is an upwards sweep, we'll have to do the opposite for omega
		i += 2; //add 2, since we added two points/normals/distances
		}
	for(r in omega) //starts loading omega's data
		{
		d[i] = f - r.distance + 0.0001; //custom added vectors above (useful for sorting) //u minus distance because we are starting from the opposite direction
		n[i] = Vector3.zero; //again, ignore the shifted infinitessimal version, since it's just for calculations, there's no collision there
		p[i] = r.point + 0.0001*w; //add because the raycast is going down, thus the addition would shift it outside of the occupied area.
		d[i+1] = f - r.distance;
		n[i+1] = r.normal;
		p[i+1] = r.point;
		i += 2;
		}
	
    s = d.Clone(); //s = d
    System.Array.Sort(d,n, new SortLedge()); //sort all these values according to distance!
    System.Array.Sort(s,p, new SortLedge()); //sort all...
	
	j = k[0]; //j = the number of collisions happening at point zero
	for(i = 1;i < length;i++) //starting at point 1, we need to start assigning k-values
		{
		     if(Vector3.Dot(n[i],w) > 0) j++; //if the normal is up, we just exited an object we were previously colliding with
		else if(Vector3.Dot(n[i],w) < 0) j--; //otherwise, if the normal is down we just entered a new object
		//if the normal was zero, don't do anything //goes without saying so there are no conditionals
		k[i] = j; //assign the k-value according to the calculations you made
		}
	
	if(g != 1)
		{
		for(i = 1; i < length;i++) //this is the debug rendering process, later you will search for an open space
		//then if there is a collision bellow those two points (i.e. k[i-2] exists and is "-1," then you can climb to that position and place the players hands
		//right above said position
			{
			o = p[i-1]; //point 1
			t = p[i]; //point 2
			
			v1 = k[i-1]; // k #1
			v2 = k[i];   // k #2
			
			     if(v1 ==  0 && v2 ==  0) free = true; //0 implies no collisions, if both of the points have no collisions, then everything between is free/open space
			else                          free = false; //otherwise the space is not free
			
			Debug.DrawLine(o,t,(free ? Color.blue : Color.red),0,false); //render the two points, blue = free, red = not free
			}
		}
	}