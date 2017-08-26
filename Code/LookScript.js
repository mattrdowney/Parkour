#pragma strict

var netView : NetworkView;

private var charX : char = 0;
private var charY : char = 0;

//Sensitivity will modify radians, so keep these values small //Radians are 2*pi or ~6.3 compared to 360 degrees
var xSen : float = 0.1; //mouse sensitivity left and right
var ySen : float = 0.1; //sensitivity up and down, usually equal to x-sensitivity

var invertY : boolean = false; //Do we want to invert the y-axis?

class Eye
	{
	//cached vars w/ protection
	private var Trans : Transform;
	private var CamTrans : Transform;
	
	//Current rotation in radians
	private var _xRot : float = 0;
	private var _yRot : float = 0;
	
	//Temporary variables
	private var w : float;
	private var z : float;
	
	//Constants
	private var pi : float = 3.141593;
	
	
	//Methods
	private function QuaternionCos (rot : float) : float
		{
		var w : float;
		this.w = Mathf.Cos(rot); //See Wikipedia for "Conversion between quaternions and Euler angles"
		if(rot < 0) this.w *= -1;
		return this.w;
		}

	private function QuaternionSin (rot : float) : float
		{
		var z : float;
		this.z = Mathf.Sin(rot); //See Wikipedia for "Conversion between quaternions and Euler angles"
		this.z = Mathf.Abs(this.z);
		return this.z;
		}

	function RotateX (xSen : float, xIn : float)
		{
		_xRot += xSen*xIn; //Layman's: add deltaMouse*sensitivity to current rotation
		_xRot = _xRot % pi; //Wrap the rotation so the value is always between -pi and pi
		w = QuaternionCos(_xRot); //Find the quaternions we need
		z = QuaternionSin(_xRot);
		Trans.localRotation = Quaternion(0,z,0,w); //Set object's quaternion w/ respect to it's parent (world) 
		}
		
	function RotateY (ySen : float, yIn : float)
		{
		_yRot += ySen*yIn; //Layman's: add deltaMouse*sensitivity to current rotation
		if(_yRot > pi*0.25) _yRot = pi*0.25; //If the player is looking too far up (above 90 degrees) disallow
		else if(_yRot < -0.25*pi) _yRot = -0.25*pi; //if looking too far down (below 90 degrees) disallow
		w = QuaternionCos(_yRot); //Find the quaternions we need
		z = QuaternionSin(_yRot);
		CamTrans.localRotation = Quaternion(z,0,0,w); //Set obj's quaternion w/ respect to it's parent (char)
		}
	
	public function Reset ()
		{
		Trans.localRotation = Quaternion(0,0,0,1); //Set object's quaternion w/ respect to it's parent (world) 
		CamTrans.localRotation = Quaternion(0,0,0,1); //Set obj's quaternion w/ respect to it's parent (char)
		}
	
	//One-shot methods... called on Awake()
	function SetTrans (trans : Transform) //This will be called on Awake (and only then)
		{
		Trans = trans;
		}
	
	function SetCamTrans (trans : Transform) //This will be called on Awake (and only then)
		{
		CamTrans = trans;
		}
	
	public function get xRot () : float
		{
		return _xRot;
		}
		
	public function get yRot () : float
		{
		return _yRot;
		}	
	}

private var eye : Eye; //a copy of the Eye class, so that the character has his very own

function OnSerializeNetworkView (stream : BitStream, info : NetworkMessageInfo)
	{
	if(stream.isReading)
		{
		if(!netView.isMine)
			{
			eye.Reset();
			stream.Serialize(charX);
			stream.Serialize(charY);
			eye.RotateX(1,Char2Float(charX));
			eye.RotateY(1,Char2Float(charY));
			}
		}
	else if(netView.isMine)
		{
		charX = Float2Char(eye.xRot);
		charY = Float2Char(eye.yRot);
		stream.Serialize(charX);
		stream.Serialize(charY);
		}
	}

function Awake ()
	{
	var Obj : GameObject;
	Obj = GameObject.Find("/Character");
	var Cam : GameObject;
	Cam = GameObject.Find("/Character/CameraSpike");
	eye = Eye();
	eye.SetTrans(Obj.GetComponent(Transform));
	eye.SetCamTrans(Cam.GetComponent(Transform));
	}

function LateUpdate ()
	{
//	if(netView && netView.isMine)
//		{
		var xMouse : float;
		var yMouse : float;
		xMouse = Input.GetAxisRaw("Mouse X");
		yMouse = Input.GetAxisRaw("Mouse Y");
		if(!invertY) yMouse *= -1;
		if(xMouse != 0) eye.RotateX(xSen,xMouse);
		if(yMouse != 0) eye.RotateY(ySen,yMouse);
//		}
	}

function Update ()
	{
	
	}

private function Char2Float (ch : char) : float
	{
	return parseFloat(System.Convert.ToInt32(ch))/255*Mathf.PI; //start as 0-->255, then get to float 0.0-->255.0, then divide by 255 to yield 0-->1,
	//finally multiply by PI to get 0-->PI
	}

private function Float2Char (fl : float) : char
	{
	return System.Convert.ToChar( //final step, convert to char
				System.Convert.ToInt32( //mid step, convert to float
					((fl > 0 ? fl : fl + Mathf.PI) / Mathf.PI * 255))); //Starts -PI-->PI; PI and zero are repeats (there is one repeat for every number)
					//therefore if greater than zero, then keep, otherwise add PI to remove redundancy
					//next divide the 0-->PI values by PI, yielding 0-->1
					//Last you want to multiply by 255 (which will be rounded) to yield 0-->255.
	}

//Later on add a special Char2Float and Reverse for Y, which does up and down and includes the boolean for aiming, which is stored in a check (x > 126 ? a : b)