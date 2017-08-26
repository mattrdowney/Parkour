#pragma strict

var Sub : ProceduralMaterial;

class Veins
	{
	var maxBlood : float = 1000;
	var minBlood : float = 0;
	var blood : float = 500;
	var maxRegen : float = 200;
	var regen : float = -200;
	var maxRecovery : float = 100;
	var minRecovery : float = 200;
	var recovery : float = 120;
	var bloodRatio : float;
	}

var veins : Veins = Veins();

function Update ()
	{
	if(veins.recovery>veins.maxRecovery) veins.recovery = veins.maxRecovery;
	if(veins.recovery>veins.minRecovery) veins.recovery -= 8*Time.deltaTime;
	if(veins.recovery<veins.minRecovery) veins.recovery = veins.minRecovery;
	
	veins.regen += veins.recovery*Time.deltaTime; 
	if(veins.regen>veins.maxRegen) veins.regen = veins.maxRegen;

	veins.blood += veins.regen*Time.deltaTime;
	
	if(veins.blood>veins.maxBlood) veins.blood = veins.maxBlood;
	if(veins.blood<veins.minBlood) veins.blood = veins.minBlood; //this is temporary, normally kill
	
	veins.bloodRatio = 1 - veins.blood/veins.maxBlood;
	
	Sub.SetProceduralFloat ("BloodLevel", veins.bloodRatio);
	
	Sub.RebuildTextures();
	}

function ApplyDamage(damage : float)
	{
	veins.blood -= damage;
	}
function ApplyBleed(bleed : float)
	{
	veins.regen -= bleed;
	}
	