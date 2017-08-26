#pragma strict

var trans : Transform;
var delta : float = 0.01;

function Start ()
	{
	var obj : GameObject = GameObject.Find("/Character");
	trans = obj.GetComponent(Transform);
	}

function Update ()
	{
	Warp();
	}

function Warp ()
	{
	if(trans.position.x > 100)
		{
		trans.position.x -= 200;
		Switch();
		}
	else if(trans.position.x < -100)
		{
		trans.position.x += 200;
		Switch();
		}
	if(trans.position.z > 100)
		{
		trans.position.z -= 200;
		Switch();
		}
	else if(trans.position.z < -100)
		{
		trans.position.z += 200;
		Switch();
		}
	}

function Switch ()
	{
	if(trans.position.y > 0) trans.position.y -= (2000 - delta);
	else                     trans.position.y += (2000 + delta);
	}