var Trans : Transform;
var Cam : GameObject;
var Rigid : Rigidbody;
var Laser : GameObject;
var Muzzle : GameObject;
var Stock : GameObject;
var projectile : GameObject;
var Sub : ProceduralMaterial;
var Host : GameObject;

class Shotgun
	{
	var timer : float;
	var broke : boolean;
	var dot : RaycastHit;
	var fireInterval : float = 0.25;
	var bulletTimeStamp : float = -100;
	var bulletCount : int = 0;
	var bulletCountTotal : int = 1;
	var pelletCount : int = 0;
	var pellets : int = 12;
	var shotSpread : float = 0.1;
	var hit : RaycastHit;
	var damage : float;
	var baseDamage : float = 100;
	var stealthMult : float;
	var vertMult : float;
	var randomNum : float;
	var randomMult : float;
					
	var bleed : float;
	var baseBleed : float = 1;
	var rangeMult : float;
	var total : float = 0;
	var i : float = 0;
	var ADSSave : float = 0;
	var ADSTime : float = 0.3;
	}
	
var shotgun : Shotgun = Shotgun();

function Update ()
	{
	Dot();
	}

function LateUpdate ()
	{
	GunFade();
	if(Input.GetButtonDown("Alt Fire"))
		{
		shotgun.timer = 0;
		shotgun.broke = false;
		}
	if(Input.GetButton("Alt Fire") && !shotgun.broke)
		{
		shotgun.timer += Time.deltaTime;
		if(shotgun.timer > 2)
			{
			Alt(shotgun.timer);
			shotgun.broke = true;
			}
		}
	if(Input.GetButtonUp("Alt Fire") && !shotgun.broke)
		{
		Alt(shotgun.timer);
		}
	if(Input.GetButtonDown("Fire"))
		{
		shotgun.timer = 0;
		shotgun.broke = false;
		}
	if(Input.GetButton("Fire") && !shotgun.broke)
		{
		shotgun.timer += Time.deltaTime;
		if(shotgun.timer > 2)
			{
			Fire(shotgun.timer);
			shotgun.broke = true;
			}
		}
	if(Input.GetButtonUp("Fire") && !shotgun.broke)
		{
		Fire(shotgun.timer);
		}
	}

function Dot ()
	{
	var clone : GameObject;
	var line : LineRenderer;
	if(Physics.Raycast(Laser.transform.position, Cam.transform.TransformDirection(Vector3(0,0,1)), shotgun.dot, 1000, ~(1 << 12)))
		{
		clone = clone.Instantiate(projectile);
        line = clone.GetComponent(LineRenderer);
            
        line.SetPosition(0, shotgun.dot.point);
        line.SetPosition(1, Laser.transform.position);
        
        line.material.SetFloat ("_InvFade",3); 
        line.material.SetColor("_TintColor", Color(.5,0,0,1));
        clone.Destroy(clone, 0.001);
		}
	else
		{
		clone = clone.Instantiate(projectile);
        line = clone.GetComponent(LineRenderer);
            
        line.SetPosition(0, Laser.transform.position + 1000*Laser.transform.TransformDirection(Vector3(0,0,1)));
        line.SetPosition(1, Laser.transform.position);
        
        line.material.SetFloat ("_InvFade",3); 
        line.material.SetColor("_TintColor", Color(.5,0,0,1));
        clone.Destroy(clone, 0.001);
		}
	}

function GunFade ()
	{
	if       ((!Input.GetButton("Sprint") || Rigid.useGravity) && shotgun.ADSSave != shotgun.ADSTime) shotgun.ADSSave += Time.deltaTime;
	else if  ((Input.GetButton("Sprint") || !Rigid.useGravity) && shotgun.ADSSave != 0)              shotgun.ADSSave -= Time.deltaTime;
	
	if       (shotgun.ADSSave > shotgun.ADSTime) shotgun.ADSSave = shotgun.ADSTime;
	else if  (shotgun.ADSSave < 0)                               shotgun.ADSSave = 0;
	
	if(shotgun.ADSSave != 0)
		{
		//Vis.range *= shotgun.ADSSave/shotgun.ADSTime + 1;
		}
		
	var alpha : float = 0.2;
	
	//Vis.range = 100*(heart.heartrate + 185)/200;
	
	alpha = .5 - 0.35*shotgun.ADSSave/shotgun.ADSTime;
	
	Sub.SetProceduralFloat ("Alpha", alpha);
	
	Sub.RebuildTextures();
	}

function Shoot (timer : float, sense : boolean)
	{
	var maxSpread : float = 0.2 - 0.2*timer;
	var direction : Vector3;
	var newDir : Vector3;
	var hitpoint1 : Vector3;
	var clone : GameObject;
	var line : LineRenderer;
	var clone1 : GameObject;
	var line1 : LineRenderer;
	//for(shotgun.bulletCount = 0; shotgun.bulletCount < shotgun.bulletCountTotal; shotgun.bulletCount++)
	//{
	for(shotgun.pelletCount = 0; shotgun.pelletCount < shotgun.pellets; shotgun.pelletCount++)
	{
	var v : Vector2 = Random.insideUnitCircle;
	var vx : float = v.x*v.x*maxSpread;
	var vy : float = v.y*v.y*maxSpread;
	var vz : float;
	if(sense) vz = 1;
	else vz = -1;
	direction = Trans.TransformDirection(Vector3(vx,vy,vz));
	Host.SendMessage("ApplyPellet", -direction);
	if(Physics.Raycast((sense ? Muzzle.transform.position : Stock.transform.position), direction, shotgun.hit, 1000, ~(1 << 12)))
		{
		hitpoint1 = shotgun.hit.point;
		
        clone = clone.Instantiate(projectile);
            
        line = clone.GetComponent(LineRenderer);
            
        line.SetPosition(0, shotgun.hit.point);
        line.SetPosition(1, (sense ? Muzzle.transform.position : Stock.transform.position));
		if(shotgun.hit.collider.tag == "Player")
			{
			shotgun.damage = shotgun.baseDamage;
					
			shotgun.stealthMult = 1.5 + 0.5*Mathf.Cos(shotgun.hit.transform.rotation.y - Cam.transform.rotation.y);
			shotgun.vertMult = Mathf.Pow(1,2); //debugging
			shotgun.randomNum = Random.Range(-1.098612,1.098612);
			shotgun.randomMult = Mathf.Log(shotgun.randomRange);
					
			shotgun.total += shotgun.randomMult;
			shotgun.i++;
					
			shotgun.damage *= shotgun.stealthMult;
			shotgun.damage *= shotgun.randomMult;
					
			shotgun.bleed = shotgun.baseBleed;
					
			shotgun.rangeMult = shotgun.hit.distance;
					
			shotgun.bleed *= shotgun.rangeMult;
					
			if(shotgun.hit.rigidbody) shotgun.hit.collider.SendMessage("ApplyPellet", direction*2);
			shotgun.hit.collider.SendMessage("ApplyDamage",shotgun.damage);
			shotgun.hit.collider.SendMessage("ApplyBleed", shotgun.bleed);
			}
		else if(shotgun.hit.collider.hingeJoint)
			{
			shotgun.hit.rigidbody.WakeUp();
			yield;
			shotgun.hit.transform.hingeJoint.spring.spring = 1;
			shotgun.hit.rigidbody.AddForceAtPosition(Cam.transform.TransformDirection(Vector3.forward)*100, shotgun.hit.point); 
			}
		else if(shotgun.hit.rigidbody)
			{
			shotgun.hit.rigidbody.AddForce(direction*100);
			}
		newDir = Vector3.Reflect(direction, shotgun.hit.normal);
		if(Physics.Raycast(shotgun.hit.point, newDir, shotgun.hit, 1000, ~(1 << 12)))
			{
        	clone1 = clone1.Instantiate(projectile);
            
        	line1 = clone1.GetComponent(LineRenderer);
            
        	line1.SetPosition(0, shotgun.hit.point);
        	line1.SetPosition(1, hitpoint1);
			if(shotgun.hit.collider.tag == "Player")
				{
				shotgun.damage = shotgun.baseDamage;
					
				shotgun.stealthMult = 1.5 + 0.5*Mathf.Cos(shotgun.hit.transform.rotation.y - Cam.transform.rotation.y);
				shotgun.vertMult = Mathf.Pow(1,2); //debugging
				shotgun.randomNum = Random.Range(0.001,0.999);
				shotgun.randomMult = ((Mathf.Log10((1-shotgun.randomNum)/shotgun.randomNum)) + 6.906755)/13.81351;
					
				shotgun.total += shotgun.randomMult;
				shotgun.i++;
					
				shotgun.damage *= shotgun.stealthMult;
				shotgun.damage *= shotgun.randomMult;
					
				shotgun.bleed = shotgun.baseBleed;
						
				shotgun.rangeMult = shotgun.hit.distance;
						
				shotgun.bleed *= shotgun.rangeMult;
						
				if(shotgun.hit.rigidbody) shotgun.hit.collider.SendMessage("ApplyPellet", newDir*2);
				shotgun.hit.collider.SendMessage("ApplyDamage",shotgun.damage);
				shotgun.hit.collider.SendMessage("ApplyBleed", shotgun.bleed);
				}
			else if(shotgun.hit.collider.hingeJoint)
				{
				shotgun.hit.rigidbody.WakeUp();
				yield;
				shotgun.hit.transform.hingeJoint.spring.spring = 1;
				shotgun.hit.rigidbody.AddForceAtPosition(newDir*100, shotgun.hit.point); 
				}
			else if(shotgun.hit.rigidbody)
				{
				shotgun.hit.rigidbody.AddForce(newDir*100);
				}
			}
		else //if ricochet never hits
			{
			clone1 = clone1.Instantiate(projectile);
            
        	line1 = clone1.GetComponent(LineRenderer);
            
        	line1.SetPosition(0, hitpoint1 + newDir*1000);
        	line1.SetPosition(1, hitpoint1);
			}
		}
	else //if bullet never hits
		{
		clone = clone.Instantiate(projectile);
            
        line = clone.GetComponent(LineRenderer);
            
        line.SetPosition(0, (sense ? Muzzle.transform.position : Stock.transform.position) + direction*1000);
        line.SetPosition(1, (sense ? Muzzle.transform.position : Stock.transform.position));
		}
	}
	
	//}
	
	}
function Fire(timer : float)
	{
	Shoot(timer,true);
	}

function Alt(timer : float)
	{
	Shoot(timer,false);
	}