#pragma strict

//next 3 are cached variables to increase performance
var Trans : Transform;

var Rigid : Rigidbody;

var Hing : HingeJoint;

//resting position in Eulers.y for the (saloon) door
//ie where it is initially placed in the scene, called at start
var rest : float;
rest = Trans.eulerAngles.y;

function Update ()
	{
    //this line makes sure we aren't checking when the door is at rest (optimization)
	if(Hing.spring.spring < 2)
		{
		//when the door is barely moving
		if(Mathf.Approximately(0,Rigid.angularVelocity.y))
			{
			//make the door swing faster, also stops sleep
			//(we don't necessarily want the door to sleep)
			Hing.spring.spring += Time.deltaTime;
			//if the door is approximately at resting position
			if(Mathf.Approximately(rest,Trans.eulerAngles.y))
				{
				//make the door stop all angular velocity
				Rigid.angularVelocity.y = 0;
				//manually place the door at the resting position
				Trans.eulerAngles.y = rest;
				//manually force the door to sleep
				Rigid.Sleep();
				}
			}
		}
	}
	
function OnCollisionEnter ()
	{
	//THIS IS IMPORTANT
	//if this weren't here, the door spring would increment to infinity
	//making it swing super fast in the future, compounded each time the door is hit
	//AND continue to reach approximately plus or minus 6 degrees, not perfect equilibrium position
	Hing.spring.spring = 1;
	}

function OnCollisionExit ()
	{
	Rigid.WakeUp();
	}
	
