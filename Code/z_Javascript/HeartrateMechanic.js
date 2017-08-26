var heartSource : AudioSource;
var trans : Transform;

function Update ()
{
	Pulse();
	BPM();
}

public function BPM ()
	{
	//effort is 1 if the player is sprinting, 0 if standing still
	var effort : float = (Vector3.Distance(trans.position,heart.lastPosition)/Time.deltaTime) / (8f);
	
	heart.lastPosition = trans.position;
	
	//based on effort, where heartrate wants to be
	heart.targetVelocity = (heart.minV/160)*(heart.heartrate - heart.tempMinHeartrate) + heart.maxV*heart.effort;
	
	//accelerate the heartrate so that it reaches targetVelocity
	if       (heart.targetVelocity > heart.curV)  heart.curA = heart.maxA;
	else if  (heart.targetVelocity < heart.curV)  heart.curA = heart.minA;
	else                                          heart.curA = 0;
	
	//enforce acceleration
	heart.curV += heart.curA*Time.deltaTime;
	heart.heartrate += heart.curV*Time.deltaTime;
	
	if        (heart.curV < heart.minV) heart.curV = heart.minV;
	else if   (heart.curV > heart.maxV) heart.curV = heart.maxV;
	
	//enforce minimum and maximum heartrate
	if       (heart.heartrate < heart.tempMinHeartrate) heart.heartrate = heart.tempMinHeartrate;
	else if  (heart.heartrate > heart.tempMaxHeartrate) heart.heartrate = heart.tempMaxHeartrate;

	//Create the heartrate modifier that affects all of the player's actions
	heart.modifier = (heart.heartrate + 125)/160;
	}

public function Pulse ()
{
	if(heart.nextPlayTime <= Time.time)
	{
		if(heart.downbeat)
		{
			heartSource.PlayOneShot(heart.downbeats,heart.volume);
			heart.nextPlayTime += (60f/heart.heartrate)*heart.fraction; //fractional piece (intended to be small e.g 2nd "dum" in dum-dum)
		}
		else //if(upbeat)
		{
			if(heart.heartrate > 70f) heartSource.PlayOneShot(heart.upbeats,heart.volume*heart.percent*Mathf.Pow((heart.maxHeartrate - heart.heartrate)/(heart.maxHeartrate - 70f),3)); //make the upbeat quieter during fast heartbeats
			else					  heartSource.PlayOneShot(heart.upbeats,heart.volume*heart.percent);
			heart.nextPlayTime += (60f/heart.heartrate)*(1 - heart.fraction); // fractional remainder of 1 (longer; the pause after dum-dum)
		}
		heart.downbeat = !heart.downbeat;
	}
}

class Heart
	{
	var lastPosition : Vector3;
	
	var heartrate : float = 40;
	var maxHeartrate : float = 215;
	var minHeartrate : float = 15;
	var tempMaxHeartrate : float = 195;
	var tempMinHeartrate : float = 35;
	
	var maxV : float = 10;
	var minV : float = -10;
	var curV : float = 0;
	
	var maxA : float = 2;
	var minA : float = -2;
	var curA : float = 0;

	var targetVelocity : float;;
	var effort : float;
	
	var modifier : float = 1;
	
	var nextPlayTime : float = 0f;
	var downbeat : boolean = true;
	
	var downbeats : AudioClip;
	var upbeats   : AudioClip;
	
	var fraction : float = 0.35f; //percent interval between upbeat and downbeat
	var percent  : float = 0.8f ; //percent of loudness of upbeat compared to the louder downbeat
	var volume : float = 1f;
	}
	
var heart : Heart = Heart();