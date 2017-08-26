#pragma strict

var trans : Transform;

var position : Vector3;
var oldPosition : Vector3;

function Start ()
	{
	trans = transform;
	position = trans.position;
	oldPosition = position;
	}

function FixedUpdate ()
	{
	oldPosition = position;
	position = trans.position;
	Physics.OverlapSphere((position + oldPosition)/2,Vector3.Distance(position,oldPosition)/2, (1 << 0));
	}