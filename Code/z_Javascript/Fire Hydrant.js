/*#pragma strict

var Hydro : GameObject;

class Veins
	{
	var maxScrap : float = 1000;
	var minScrap : float = 0;
	var scrap : float = 1000;
	var degen : float = 0;
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
	}

function ApplyDamage(damage : float)
	{
	veins.blood -= damage;
	}
function ApplyBleed(bleed : float)
	{
	veins.regen -= bleed;
	}
*/	