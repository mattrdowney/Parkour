#pragma strict


var trans : Transform;
var mesh : SkinnedMeshRenderer;
var mat : Material;

function Update ()
{
	Health();
	vein.min = trans.position.y + mesh.localBounds.center.y + mesh.localBounds.extents.y;
	vein.threshold = vein.min - (vein.blood/vein.maxBlood)*mesh.localBounds.size.y;
	mat.SetFloat("_Threshold",vein.threshold);
}

function Health ()
{
	if(vein.regen != vein.maxRegen)
	{
		vein.regen += vein.recovery*Time.deltaTime; 
		if(vein.regen>vein.maxRegen) vein.regen = vein.maxRegen;
	}
	if(vein.blood<vein.minBlood)
	{
		vein.dead = true;
		vein.blood = vein.maxBlood;
		vein.regen = vein.maxRegen;
	}
	if(vein.blood != vein.maxBlood)
	{
		vein.blood += vein.regen*Time.deltaTime;
		if(vein.blood > vein.maxBlood) vein.blood = vein.maxBlood;
	}
}

private class Vein
{
	var dead : boolean = true;
	
	var min : float = 0;
	var threshold : float = 0;
	
	var blood : float = 800;
	var maxBlood : float = 1000;
	var minBlood : float = 0;
	
	var regen : float = -500;
	var maxRegen : float = 200;
	
	var recovery : float = 200;
}

private var vein : Vein = Vein();
