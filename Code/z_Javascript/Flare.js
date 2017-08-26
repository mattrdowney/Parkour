var stuck : boolean = false;
var life : float = 2.8;
var lighter : Light;
lighter = GetComponent(Light);

function Start ()
	{
	rigidbody.AddRelativeForce(Vector3(0,0,28),ForceMode.VelocityChange);//67
	}

function OnCollisionEnter (body : Collision)
	{
	if(body.contacts[0].otherCollider.transform && !stuck) {transform.parent = body.contacts[0].otherCollider.transform;}
	//rigidbody.velocity = Vector3(0,0,0);
	rigidbody.isKinematic = true;
	stuck = true;
	rigidbody.constraints = RigidbodyConstraints.None;
	collider.enabled = false;
	}
	
function Update ()
	{
	life -= Time.deltaTime;
	lighter.intensity = 0.47*life/2.8;
	if(life < 0) Destroy(gameObject);
	}
	