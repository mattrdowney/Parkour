#pragma strict

var paused : boolean = false;

//Köpfchenkrieg (mind war, probably not)

class Muscle
	{
	//Methods
	function FixedUpdate ()
		{
			//Reading this is pointless //
			time = Time.deltaTime; //hurp
			position = rigid.position; //durp
			var oldPos : Vector3 = position; //log the origin (before movements are factored in)
			foot.normal = Vector3.zero; //zero off the foot normal so we don't do anything stupid
			//END POINTLESS
			
			
			
			
			if(moveDir.sqrMagnitude > 1) moveDir.Normalize(); //otherwise strafing on PC's you could move @ 1.41*maxSpeed
			moveDir = trans.TransformDirection(moveDir);
	
			//The gist of it: if grounded, check .8meters below you, otherwise check 0.05meters down or the distance the player will travel that frame (whichever is farther)
			//The function itself will then find the normal below the player and snap him to 0.02meters above said point
			foot = IterationArray(position,coll.radius,coll.height/2,-Vector3.up,
			                     (velocity.y*time < -0.05 ? -velocity.y*time : 0.05),0.8, velocity, grounded); //what's below you?
			                     
			                     
			if(grounded && foot.distance == Mathf.Infinity) Derail(); //if the player stops being grounded, start falling
			
			
			
			adjMoveDir = Pace(foot.normal,moveDir); //Find a suitable direction along a plane
			
			oAdjMoveDir = adjMoveDir; //log this because it will likely change when it's needed most.
			
			
			if(grounded && velocity.sqrMagnitude < baseSpeed*baseSpeed*sprintMult*sprintMult*1.2) Run(); //then run along that direction if possible
			else if(grounded) //If surfing quickly across the ground
				{
				velocity = Slide(velocity,adjMoveDir,gravitation,foot.normal); //then you slide along the ground instead
				}
		
			if(!grounded) Gravitate(); //Apply gravity
			preVel = velocity; //log information for later calculations
			
			var i : int = 0;
			var j : int;
			var length : int = 10;
			var awk : boolean = false;
			var oneShot : boolean = true; //one shot became necessary because of wall behavior, it ensures no more than one extra wall check is made.
			//oneShot used to be called reterminal aka "Return Terminal".  Don't know which name is cooler though.
			
			n = new Vector3[length];
			b = new boolean[length];
			
			//Start Collisions
			while(time > 0 && i < length && (i == 0 || n[i-1] != Vector3.zero) && oneShot)  
				{ //get some collision normals!
				if(time == 0) oneShot = false;
				if(i < p.Length)
					{
					var temp0 : Vector3 = position;
					var temp1 : Vector3 = Vector3(0,coll.height/2 - coll.radius,0);
					var temp2 : Vector3;
					
					//handles collisions from OnCollisionStay!
					if     (p[i].y > temp0.y + temp1.y)      temp2 = temp0 + temp1 - p[i]; //top of capsule
					else if(p[i].y < temp0.y - temp1.y)      temp2 = temp0 - temp1 - p[i]; //bottom of capsule
					else   {                                 temp2 = temp0 - p[i]; temp2.y = 0;} //middle of capsule // !!!notice two lines in one!!!
					
					temp2.Normalize();
					n[i] = temp2;
					}
				else if(i == p.Length)
					{
					velocity = preVel;
					n[i] = UltimateIterationArray(position,coll.height/2,coll.radius,velocity.normalized,velocity.magnitude, preVel.magnitude, time,grounded);
					}
				else
					{
					n[i] = UltimateIterationArray(position,coll.height/2,coll.radius,velocity.normalized,velocity.magnitude, preVel.magnitude, time,grounded);
					}
					
				if(n[i] != Vector3.zero) //if n[i] != Vector3.zero (that is, it does exist)
					{
					if(n[i].y < -0.05) //ceiling
						{
						if(Vector3.Dot(velocity,n[i]) < 0)
							{
							ceiled = true;
							if(i < p.Length) awk = true;
							if(grounded) velocity = Vector3.Project(velocity,Vector3.Cross(n[i],foot.normal).normalized); //move along the intersection of two planes
							else velocity -=  Vector3.Project(velocity,n[i]); //normally project a velocity along a slope
							}
						b[i] = false;
						}
					else if(n[i].y < 0.05) //walls //this checks between the -0.05-->0.05 range // due (in part) to previous if statement
						{
						if(Vector3.Dot(velocity,n[i]) < 0)
							{
							var tmp : Vector3;
							tmp = -Vector3.Cross(n[i],Vector3(0,1,0)).normalized; //this is not complicated enough
							
							//planar equation: ax + by + cz + d = 0
							//(a,b,c) = slope of the plane or the magnitude of normal vector's components aka stored *(foot.normal)*
							//"d" is zero because of our coordinate system.
							//(x,y,z) is partially known, we know x is tmp.x and z is tmp.z 							

							var y : float; //find "y" by y = (-ax - cz)/b
							y = -(foot.normal.x*tmp.x - foot.normal.z*tmp.z)/foot.normal.y;
							
							var newDir = Vector3(tmp.x,y,tmp.z);
							
							newDir.Normalize();

							if(grounded)
								{
								velocity = Vector3.Project(velocity,tmp); //project the velocity onto the wall's axis
								var trueVelocity : float = velocity.magnitude; //this is the true velocity, keep it for later.
								
								velocity = Vector3.Project(velocity,newDir); //project the velocity onto the floor's plane
								velocity.Normalize(); //normalize the velocity since it is lower than it should be
								velocity*= trueVelocity; //multiply the unit velocity by the true velocity
								}
							else velocity -=  Vector3.Project(velocity,n[i]); //normally project a velocity along a slope
							b[i] = true;
							}
						else b[i] = false;
						}
					else //floor
						{
						b[i] = false;
						if(Vector3.Dot(velocity,n[i]) < 0)
							{
							velocity -=  Vector3.Project(velocity,n[i]);
							Ground();
							foot.normal = n[i];
							adjMoveDir = Pace(foot.normal,moveDir); //Find a suitable direction along a plane
                            if(velocity.sqrMagnitude < baseSpeed*baseSpeed*sprintMult*sprintMult*1.2) Run();
							}
						}
					}
				else b[i] = false;
				//END COLLISION DETECTION AND PLACEMENT
				
				
				
				
				
				
				//START NEUTRALIZE VELOCITY (for corners (2 oblique or perpendicular walls))
				if(i > 0)
					{
					for(j = i-1;j > -1;j--)
						{
						if(b[i] && b[j])
							{
							if(Neutralize(n[j],n[i],moveDir))
								{
								velocity.x = 0;
								velocity.z = 0;
								if(grounded) velocity.y = 0;
								time = 0;
								oneShot = false;
								}
							}
						}
					}
				i++;
				}
				//END Neutralize velocity
			



			//JUMP functions			
			if(lastJumpDown + 0.2 > Time.time && grounded && !ceiled) //if the floor is close, ceiling is far, and
			//the player clicked the space bar in the last .2 seconds, then jump
				{
				adjMoveDir = Pace(foot.normal,moveDir); //Find a suitable direction along a plane
				if(n[i] == Vector3.zero && velocity.sqrMagnitude < baseSpeed*baseSpeed*sprintMult*sprintMult*1.2)
					{
					Run();
					velocity.y = Jump(velocity.y, jumpHeight);
					}
				else //sliding jump should be perpendicular to the surface
					{
					velocity = BinormalJump(velocity,jumpHeight,foot.normal);
					}
				lastJumpDown = -100; //make sure the player doesn't jump twice
				grounded = false; //since we jumped we are no longer grounded
				}
				
				
			ceiled = false; //disable for next frame
			rigid.MovePosition(position + velocity*time); //position from collisions + the remaining distance*modified velocity
		} //End FixedUpdate//
		
	

	private function IterationArray(pos : Vector3,radii : float, heightHalf : float,dir : Vector3,lowDist : float,highDist : float, vel : Vector3, ground : boolean) : RaycastHit
		{
		var hit : RaycastHit;
		var hit2 : RaycastHit;
		
		var radius : float = radii - 0.02;
	
		var place : Vector3 = pos;
	
		var p1 : Vector3 = pos + (radius-heightHalf)*Vector3.up;
		
		var ledge : boolean = false;
		
		var dist : float;
		
		if(ground) dist = highDist;
		else dist = lowDist;
		
		if(Physics.CheckCapsule(p1,p1 + dir*dist,radius, (1 << 0))) //if there is a floor below us
			{
			if(Physics.Raycast(p1,dir,hit,Mathf.Infinity,(1 << 0)) //if a raycast down returns true
				&& Physics.Raycast(p1,-hit.normal,hit2,Mathf.Infinity, (1 << 0)) //and a raycast anti-normal to that ray's returned normal returns true
					&& (hit.distance < radii + dist + 0.022 || hit2.distance < radii + dist + 0.022) //and the distance to either point is less than 0.022 (0.02 is buffer room, 0.002 accounts for error in floating point conversions)
						&& !Physics.CheckSphere(p1 + dir*(hit.distance-0.02)/hit.normal.y,radii,(1 << 0)))//and the place that the player would occupy is empty, hence the (!collision/!check) part 
						{
						hit.distance = (hit.distance > hit2.distance ? hit2.distance - radii : hit.distance - radii);  //take the smaller of these two distances
						}
			else if(Physics.SphereCast(p1,radii,dir,hit2,dist,(1 << 0)))
						{
						ledge = true;
						if(Physics.Raycast(p1,dir,hit,radius + dist,(1 << 0)))
							{
							hit.distance = hit2.distance;
							}
						else
							{
							hit = hit2;
							if(vel.y < 0) //ledge behavior
								{
								if(ground) vel = Rejecto(vel, -dir); 
								Ground();
								AssignVel(vel);
								}
							}
						}
			else //if the capsuleCast had too low of precision to be detected
						{
						hit.distance = Mathf.Infinity;
						}
			}
		else hit.distance = Mathf.Infinity;
	
		if(hit.distance != Mathf.Infinity)
			{
			if(Vector3.Dot(vel,hit.normal) < 0)
				{
				if(ground) vel = Rejecto(vel,hit.normal);
				Ground();
				if(!ledge) place += dir*(hit.distance-0.02)/hit.normal.y;
				else place += dir*(hit.distance-0.06);
				AssignVel(vel);
				}
			else if(Clamp(ground,vel,hit.normal))
				{
				Ground();
				if(!ledge) place += dir*(hit.distance-0.02)/hit.normal.y;
				else place += dir*(hit.distance-0.06);
				}
			}
		AssignPos(place);
		return hit;
		}

	private function UltimateIterationArray(pozition : Vector3,heightHalf : float,radius : float,dir : Vector3,speed : float,oSpeed : float, timeNaught : float, ground : boolean) : Vector3
		{	
		var hit : RaycastHit;
		var hit2 : RaycastHit;
		
		if(dir == Vector3.zero) return Vector3.zero;
		
		var p1 : Vector3 = pozition + (radius-heightHalf)*Vector3.up; //the lower portion //Must be first (info):
		var p2 : Vector3 = pozition + (heightHalf-radius)*Vector3.up; //the upper portion //http://forum.unity3d.com/threads/130169-Why-CaspsuleCast-is-buggy
		
		var product : Vector3 = dir*oSpeed*timeNaught;
		
		var place : Vector3 = pozition; //the character's position (which is changed in two segments when colliding with walls)
		var reach : float = timeNaught; //time
		var temp : float; //the time exhausted in moving the player's position into contact with the wall
		var special : boolean = false;
		
		if(Physics.CheckCapsule(p1 + product, p2 + product,radius, (1 << 0))) //if the place the player wants to move to is occupied
			{
			//foot
			if(Physics.Raycast(p1,dir,hit,Mathf.Infinity,(1 << 0)) && Physics.Raycast(p1,-hit.normal,hit2,radius + 0.022, (1 << 0))) //check w/ THE Ultimate Iteration Array along the floor
				{
				hit.distance = hit2.distance - radius;
				temp = (hit.distance - 0.02)/Vector3.Dot(dir,-hit.normal)/speed;
				
				if(temp < 0) //trying to go backwards in time!!!
					{
					temp = 0;
					reach = timeNaught;
					if(!Physics.CheckCapsule(p1 + product + hit.normal*(0.02 - hit.distance), p2 + product + hit.normal*(0.02 - hit.distance),radius,(1 << 0)))
						{
						place += hit.normal*(0.02 - hit.distance);
						}
					}
				else reach -= temp;
				
				if(reach < 0) { reach = 0; place += dir*speed*timeNaught;}
				else place += dir*temp*speed;
				}
			//head
			else if(Physics.Raycast(p2,dir,hit,Mathf.Infinity,(1 << 0)) && Physics.Raycast(p2,-hit.normal,hit2,radius + 0.022, (1 << 0))) //check w/ THE Ultimate Iteration Array along the ceiling
				{
				hit.distance = hit2.distance - radius;
				temp = (hit.distance - 0.02)/Vector3.Dot(dir,-hit.normal)/speed;
				
				if(temp < 0) //trying to go backwards in time!!!
					{
					temp = 0;
					reach = timeNaught;
					if(!Physics.CheckCapsule(p1 + product + hit.normal*(0.02 - hit.distance), p2 + product + hit.normal*(0.02 - hit.distance),radius,(1 << 0)))
						{
						place += hit.normal*(0.02 - hit.distance);
						}
					}
				else reach -= temp;
				
				if(reach < 0) { reach = 0; place += dir*speed*timeNaught;}
				else place += dir*temp*speed;
				}				
			//accurate but expensive capsuleCast
			else if(Physics.CapsuleCast(p1,p2,radius,dir,hit,oSpeed*timeNaught,(1 << 0))) //check with a precise capsuleCast
				{
				var aTempT : float = 0.02/Vector3.Dot(dir,-hit.normal);
				temp = (hit.distance - aTempT)/speed; //distance divided by speed is time //  
				
				if(temp < 0) { temp = 0; reach = timeNaught; } //if time is negative
				else reach -= temp;
				
				if(reach < 0) { reach = 0; place += dir*speed*timeNaught;}
				else place += dir*temp*speed;
				}
			else //if there really wasn't anything there (even though there supposedly was)
				{
				reach = 0;
				place += speed*timeNaught*dir;
				hit.distance = Mathf.Infinity;
				hit.normal = Vector3.zero;
				}
			}
		else //we don't need to check in front of us, because nothing is there
			{
			reach = 0;
			place += speed*timeNaught*dir;
			hit.distance = Mathf.Infinity;
			hit.normal = Vector3.zero;
			}
		AssignPos(place);
		AssignTime(reach);
		
		return hit.normal;
		}	
	
	private function Neutralize(one : Vector3,two : Vector3,para : Vector3) : boolean
		{
		var perp : Vector3; //perpendicular direction
       	perp = Vector3(para.z,0,-para.x);
		
		var d1 : boolean = false;
		var d2 : boolean = false;
		
		var temp1 : Vector3;
		var temp2 : Vector3;
		
		if(Vector3.Dot(para,one) > 0) d1 = true;
		if(Vector3.Dot(para,two) > 0) d2 = true;
		
		if(d1 && d2) { /*Debug.Log(1 + " " + Time.time);*/ return false; }
		
		temp1 = para - Vector3.Project(para,one);
		temp1 = Vector3.Project(temp1,perp);
			
		temp2 = para - Vector3.Project(para,two);
		temp2 = Vector3.Project(temp2,perp);
		if(Vector3.Dot(temp1,temp2) < 0) { /*Debug.Log(2 + " " + Time.time);*/ return true; }
		
		if(d1)
			{
			temp1 = one;
			one = two;
			one = temp1;
			}
		
		temp1 = para - Vector3.Project(para,one);
		if(Vector3.Dot(temp1,two)  > 0) { /*Debug.Log(3 + " " + Time.time);*/ return true; }
		temp1 -= Vector3.Project(temp1,two);
		if(Vector3.Dot(temp1,para) < 0) { /*Debug.Log(4 + " " + Time.time);*/ return true; }
		
		return false;
		}
	
	private function Slide (vel : Vector3,u : Vector3,grav : float, norm : Vector3) : Vector3
		{
		var v : Vector3;
		v = vel.normalized;
		v.y = Mathf.Clamp(v.y,-0.9,0.9);
		vel -= Time.deltaTime*grav*v*Mathf.Exp(Mathf.Tan(Mathf.PI/2 - Mathf.Acos(v.y))/2); //Apply friction
		if(u.y < 0) vel += Vector3.Project(-grav*Time.deltaTime*Vector3.up,vel); //Project Gravity if the player wants it.
		return vel;
		}
	
	private function Pace (normal : Vector3, vect : Vector3) : Vector3
		{		
		//planar equation: ax + by + cz + d = 0
		//(a,b,c) = slope of the plane or the magnitude of normal vector's components aka stored *(foot.normal)*
		//"d" is zero because of our coordinate system.
		//(x,y,z) is partially known, we know x is tmp.x and z is tmp.z 							

		var direction : Vector3;

		var y : float; //find "y" by y = (-ax - cz)/b
		if(normal.y != 0)
			{
			y = (-normal.x*vect.x - normal.z*vect.z)/normal.y;
			direction = Vector3(vect.x,y,vect.z);
			direction.Normalize();
			}
		else
			{
			var inverse : Vector3 = Vector3(normal.z,0,-normal.x);
			var half : Vector3 = Vector3.Project(vect,inverse);
			var halfMag : float = Vector3.Project(vect,-normal).magnitude;
			direction = halfMag*Vector3.up + half;
			direction.Normalize();
			}
		
		//My old method is cheaper but noticibly (although it's infinitely better than the Google method)
		
//		//By dot product/negative inverse, this is orthogonal to the normal
//		var right : Vector3 = Vector3(normal.y,-normal.x,0); //in world space
//		var forward : Vector3 = Vector3(0,-normal.z,normal.y); //in world space
//		right.Normalize();
//		forward.Normalize();
//		
//		//the direction the player will move (tangential), which is a combination of any two non-parallel vectors on the correct plane
//		var direction : Vector3;
//		direction = right*vect.x + forward*vect.z;
//		direction.Normalize();
		return direction;
		}
	
	private function Derail ()
		{
		Stop();
		foot.normal = Vector3(0,1,0);
		adjMoveDir = Pace(foot.normal,moveDir); //Find a suitable direction along a plane
		if(velocity.sqrMagnitude < baseSpeed*baseSpeed*sprintMult*sprintMult*1.2) Run();
		grounded = false; //since we jumped we are no longer grounded
		}
	
	private function Run ()
		{
		var run : Vector3 = Vector3(0,0,0);
		run = adjMoveDir*baseSpeed*0.99*moveDir.magnitude; //still should be necessary
		if(Input.GetButton("Sprint") && grounded) run *= sprintMult; //factor in sprinting
		velocity = run; //finally set velocity (absolute, we don't want any gravity leading up to this point)
		}
	
	private function AssignPos (pos : Vector3)
		{
		position = pos;
		}
	
	private function AssignTime (reach : float)
		{
		time = reach;
		}
	
	private function AssignVel (vel : Vector3)
		{
		velocity = vel;
		}
	
	private function Clamp (ground : boolean, vel : Vector3, norm : Vector3) : boolean
		{
		if(Vector3.Dot(norm,vel) < 0) return true;
		if(vel.sqrMagnitude > baseSpeed*baseSpeed*sprintMult*sprintMult*1.2) return false;
		else if(ground) return true;
		else return false;
		}
	
	function GetMoveDir (horizontal : float, vertical : float) //The basic user-input function, which calls subsequent f(x)'s
		{
		moveDir = Vector3(horizontal, 0, vertical);
		}

	private function Gravitate ()
		{
		velocity -= Vector3.up*Time.deltaTime*gravitation;
		}
	
	private function Ground ()
		{
		grounded = true;
		}
	
	private function BinormalJump (vel : Vector3,height : float,norm : Vector3) : Vector3 //called Binormal to avoid confusion with Normal
		{
		var jumpSpeed : float = Mathf.Sqrt(19.6*jumpHeight);
		vel += jumpSpeed*norm;
		return vel;
		}
	
	private function Jump (yVel : float, jumpHeight : float) : float //Jumping when moving slowly (i.e. not "sliding")
		{
		var jumpSpeed : float = Mathf.Sqrt(19.6*jumpHeight);
		if(yVel < 0) yVel = 0;
		if(yVel < jumpSpeed - 2) yVel = jumpSpeed;
		else yVel += 2;
		return yVel;
		}
	
	function Stop ()
		{
		rigid.velocity = Vector3.zero;
		}
	
	private function Rejecto (vel : Vector3, norm : Vector3) : Vector3
		{
		if(Vector3.Dot(vel,norm) > 0) vel -= Vector3.Project(vel,norm); //if the player is/will be colliding, then reject, otherwise ignore.
		return vel;
		}
	
	//One-shot methods... called on Start()
	function SetColl (col : CapsuleCollider) //This will be called on Start (and only then)
		{
		coll = col;
		}
	
	function SetRigid (rig : Rigidbody) //This will be called on Start (and only then)
		{
		rigid = rig;
		}
	
	function SetTrans (transf : Transform) //This will be called on Start (and only then)
		{
		trans = transf;
		}
	
	function SetP(pt : Vector3[])
		{
		var i : int;
		var length : int = pt.Length;
		p = new Vector3[length];
		for(i = 0; i < length;i++)
			{
			p[i] = pt[i];
			}
		}
	
	function Set ()
		{
		n = new Vector3[0];
		b = new boolean[0];
		p = new Vector3[0];
		}
	
	//cached vars w/ protection
	@System.NonSerialized
	private var coll : CapsuleCollider;
	@System.NonSerialized
	private var rigid : Rigidbody;
	@System.NonSerialized
	private var trans : Transform;
	
	//Vector3's changable by player
	@System.NonSerialized
	private var moveDir : Vector3;
	@System.NonSerialized
	private var adjMoveDir : Vector3;
	@System.NonSerialized
	private var oAdjMoveDir : Vector3;
	
	//Other vector3's
	private var velocity : Vector3;
	@System.NonSerialized
	private var preVel : Vector3; //the original velocity for this frame, before interacting with walls and "funnels"
	@System.NonSerialized
	private var position : Vector3; //intermediate for distance calculations
	
	//Raycast info
	private var foot : RaycastHit; //raycastInfo for the floor
	
	//Booleans
	private var grounded : boolean; //is the player grounded?
	private var ceiled : boolean; //is the ceiling nearby?
	
	//Floats
	@System.NonSerialized
	private var baseGravitation : float = 9.8; //the lowest gravity can be
	@System.NonSerialized
	private var gravitation : float = 9.8; //the real value of gravity
	@System.NonSerialized
	private var baseSpeed : float = 8; //the running movement speed
	@System.NonSerialized
	private var baseHeight : float = 2; //the approximate height the player will jump, inaccurate due to progressive gravity
	@System.NonSerialized
	private var speed : float = 8; //the real speed of the player
	@System.NonSerialized
	private var jumpHeight : float = 2; //the real jump height of the player, high if he got mad hops
	@System.NonSerialized
	private var sprintMult : float = 1.85; //sprint multiplier; if the running speed of the player is one, his sprint speed will be 1.85
	@System.NonSerialized
	private var time : float; //intermediate for distance calculations
	@System.NonSerialized
	var lastJumpDown : float = -100; //the in-game time the player last requested to jump, the character will try to jump for .2 seconds before giving up
	
	//Arrays
	private var b : boolean[];
	private var p : Vector3[];
	private var n : Vector3[];
	}

private var muscle : Muscle; //a copy of the Muscle class, so that the character has his very own

function Start ()
	{
	muscle = Muscle();
	var Obj : GameObject;
	Obj = GameObject.Find("/Character");
	muscle.SetColl(Obj.GetComponent(CapsuleCollider));
	muscle.SetRigid(Obj.GetComponent(Rigidbody));
	muscle.SetTrans(Obj.GetComponent(Transform));
	muscle.Set();
	}

function OnCollisionExit()
	{
	muscle.Stop();
	muscle.SetP(new Vector3[0]);
	}

function OnCollisionStay(collision : Collision)
	{
	Debug.Log(Time.time); //Collisions have only happened in ~.45-.5m tunnels and wall-stair intersections to date) //to Matt Downey's Knowledge
	var pnt : Vector3[];
	var i : int;
	var length = collision.contacts.Length;
	if(length > 5) length = 5;
	pnt = new Vector3[length];
	for(i = 0;i < length;i++)
		{
		pnt[i] = collision.contacts[i].point;
		}
	muscle.SetP(pnt);
	}

function FixedUpdate ()
	{
	if(!paused) muscle.GetMoveDir(Input.GetAxis("Horizontal"),Input.GetAxis("Vertical"));
	else        muscle.GetMoveDir(0,0);
	muscle.FixedUpdate();
	}
	
function Update ()
	{
	if(!paused && Input.GetButtonDown("Jump")) muscle.lastJumpDown = Time.time;
	}
