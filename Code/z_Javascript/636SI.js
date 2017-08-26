var Cam : GameObject;
var Rigid : Rigidbody;
var Laser : GameObject;
var Muzzle : GameObject;
var projectile : GameObject;
var Sub : ProceduralMaterial;

class SubMachine
	{
	var dot : RaycastHit;
	var fireInterval : float = 0.16;
	var bulletTimeStamp : float = 0;
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
	
var subMachine : SubMachine = SubMachine();

function Update ()
	{
	subMachine.bulletTimeStamp += Time.deltaTime;
	Dot();
	GunFade();
	if(Input.GetButtonDown("Fire"))
		{
		subMachine.bulletCount = 0;
		subMachine.bulletTimeStamp = 0;
		}
	if(Input.GetButton("Fire"))
		{
		BulletTime();
		//Shoot();
		}
	if(Input.GetButtonUp("Fire"))
		{
		subMachine.bulletCountTotal = 0;
		}
	}
	
function LateUpdate()
	{
	if(Input.GetButton("Fire"))
		{
		Shoot();
		}
	}
	
function BulletTime()
	{
	subMachine.bulletCountTotal = (Mathf.FloorToInt(subMachine.bulletTimeStamp/subMachine.fireInterval)) + 1;
	}

function Dot ()
	{
	var clone : GameObject;
	var line : LineRenderer;
	if(Physics.Raycast(Laser.transform.position, Cam.transform.TransformDirection(Vector3(0,0,1)), subMachine.dot, 1000, ~(1 << 12)))
		{
		clone = clone.Instantiate(projectile);
        line = clone.GetComponent(LineRenderer);
            
        line.SetPosition(0, subMachine.dot.point);
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
	if       ((!Input.GetButton("Sprint") || Rigid.useGravity) && subMachine.ADSSave != subMachine.ADSTime) subMachine.ADSSave += Time.deltaTime;
	else if  ((Input.GetButton("Sprint") || !Rigid.useGravity) && subMachine.ADSSave != 0)              subMachine.ADSSave -= Time.deltaTime;
	
	if       (subMachine.ADSSave > subMachine.ADSTime) subMachine.ADSSave = subMachine.ADSTime;
	else if  (subMachine.ADSSave < 0)                               subMachine.ADSSave = 0;
	
	if(subMachine.ADSSave != 0)
		{
		//Vis.range *= subMachine.ADSSave/subMachine.ADSTime + 1;
		}
		
	var alpha : float = 0.2;
	
	//Vis.range = 100*(heart.heartrate + 185)/200;
	
	alpha = .5 - 0.35*subMachine.ADSSave/subMachine.ADSTime;
	
	Sub.SetProceduralFloat ("Alpha", alpha);
	
	Sub.RebuildTextures();
	}

function Shoot ()
	{
	//var maxSpread : float = 0.2 - 0.2*timer;
	var direction : Vector3;
	var newDir : Vector3;
	var hitpoint1 : Vector3;
	var clone : GameObject;
	var line : LineRenderer;
	var clone1 : GameObject;
	var line1 : LineRenderer;
	for(;subMachine.bulletCount < subMachine.bulletCountTotal; subMachine.bulletCount++)
	{
	var v : Vector2 = Random.insideUnitCircle;
	var vx : float = 0;
	var vy : float = 0;
	var vz : float;
	vz = 1;
	direction = Cam.transform.TransformDirection(Vector3(vx,vy,vz));
	//Rigid.AddForce(-50*direction);
	if(Physics.Raycast(Muzzle.transform.position, direction, subMachine.hit, 1000, ~(1 << 12)))
		{
		hitpoint1 = subMachine.hit.point;
		
        clone = clone.Instantiate(projectile);
            
        line = clone.GetComponent(LineRenderer);
            
        line.SetPosition(0, subMachine.hit.point);
        line.SetPosition(1, Muzzle.transform.position);
		if(subMachine.hit.collider.tag == "Player")
			{
			subMachine.damage = subMachine.baseDamage;
					
			subMachine.stealthMult = 1.5 + 0.5*Mathf.Cos(subMachine.hit.transform.rotation.y - Cam.transform.rotation.y);
			subMachine.vertMult = Mathf.Pow(1,2); //debugging
			subMachine.randomNum = Random.Range(0.001,0.999);
			subMachine.randomMult = ((Mathf.Log10((1-subMachine.randomNum)/subMachine.randomNum)) + 6.906755)/13.81351;
					
			subMachine.total += subMachine.randomMult;
			subMachine.i++;
					
			subMachine.damage *= subMachine.stealthMult;
			subMachine.damage *= subMachine.randomMult;
					
			subMachine.bleed = subMachine.baseBleed;
					
			subMachine.rangeMult = subMachine.hit.distance;
					
			subMachine.bleed *= subMachine.rangeMult;
					
			subMachine.hit.collider.SendMessage("ApplyDamage",subMachine.damage);
			subMachine.hit.collider.SendMessage("ApplyBleed", subMachine.bleed);
			}
		else if(subMachine.hit.collider.hingeJoint)
			{
			subMachine.hit.rigidbody.WakeUp();
			yield;
			subMachine.hit.transform.hingeJoint.spring.spring = 1;
			subMachine.hit.rigidbody.AddForceAtPosition(Cam.transform.TransformDirection(Vector3.forward)*100, subMachine.hit.point); 
			}
		else if(subMachine.hit.rigidbody)
			{
			subMachine.hit.rigidbody.AddForce(direction*100);
			}
		
	}
	else //if bullet never hits
		{
		clone = clone.Instantiate(projectile);
            
        line = clone.GetComponent(LineRenderer);
            
        line.SetPosition(0, Muzzle.transform.position + direction*1000);
        line.SetPosition(1, Muzzle.transform.position);
		}
	}
	}
