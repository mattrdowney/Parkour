var flare : GameObject;
var Cam : GameObject;
var Muzzle : GameObject;

function Update ()
	{
	if(Input.GetButtonDown("Fire"))
		{
		Instantiate(flare, Muzzle.transform.position, Cam.transform.rotation);
		}
	}
	