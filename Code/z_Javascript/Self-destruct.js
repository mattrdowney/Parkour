var visibility : float;

var Line : LineRenderer;

function Start ()
	{
	visibility = 0.5;
	Line = transform.GetComponentInChildren(LineRenderer);
	Line.material.SetFloat ("_InvFade",3); 
	//Line.material.SetColor("_TintColor", Color(.5,.5,.5,visibility)); 
	}

function Update ()
	{
	visibility -= Time.deltaTime/5;
	
	if(visibility < 0) Destroy(gameObject);
	
	Line.material.SetColor("_TintColor", Color(.5,.5,.5,visibility)); 
	}