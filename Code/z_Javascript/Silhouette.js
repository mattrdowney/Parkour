#pragma strict

var Sil : GameObject;
var Lit : Light;

var shader1 : Shader;
shader1 = Shader.Find("Diffuse");
var shader2 : Shader;
shader2 = Shader.Find("Outlined/Silhouetted Diffuse");

function Update()
	{
    if(Input.GetButton("Fire"))
    	{
    	Enable();
        Sil.renderer.material.shader = shader2;
    	}
    else
    	{
    	Disable();
    	Sil.renderer.material.shader = shader1;
    	}
	
	if(Input.GetButtonDown("Fire"))
		{
		//Kusanagi();
		}
	}

function Kusanagi ()
	{
	Lit.light.enabled = !Lit.light.enabled;
	
	yield WaitForSeconds(0.1);
	
	if (Input.GetButton("Fire"))
		{
		StartCoroutine("Kusanagi");
		}
	else Lit.light.enabled = false;
	}
	
function Enable ()
	{
	Lit.light.enabled = true;
	}
	
function Disable ()
	{
	Lit.light.enabled = false;
	}