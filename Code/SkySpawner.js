//#pragma strict
//
//var omniscient : GameObject;
//var character : GameObject;
//var netPlayer : NetworkPlayer;
//
//function Start ()
//	{
//	omniscient = GameObject.Find("/Oculus");
//	
//	var min : float;
//	min = Mathf.Min(Screen.width,Screen.height);
//	
//	omniscient.camera.aspect = 1;
//	omniscient.camera.pixelRect = Rect(0,0,min,min);
//	}
//	
//function OnConnectedToServer ()
//	{
//	Network.Instantiate(character,Vector3.zero,Quaternion.identity,0);
//	}
//
//function Update ()
//	{
//	if(Input.GetButtonDown("Fire1"))
//		{
//		Click();
//		}
//	}
//
//function Click ()
//	{
//	var godRay : Ray;
//	var godRayHit : RaycastHit;
//	
//	var min : float;
//	min = Mathf.Min(Screen.width,Screen.height);
//	
//	if(Input.mousePosition.x <= min && Input.mousePosition.y <= min)
//		{
//		godRay = omniscient.camera.ViewportPointToRay(Vector3(Input.mousePosition.x/min,Input.mousePosition.y/min,0));
//		if(Physics.SphereCast(godRay,0.5,godRayHit,Mathf.Infinity,(1 << 0)))
//			{
//			RequestSpawn(Vector3(godRayHit.point.x,godRayHit.point.y + 500,godRayHit.point.z));
//			//CharacterComplex.Spawn(Vector3(godRayHit.point.x,godRayHit.point.y + 500,godRayHit.point.z));
//			//Trans.position = Vector3(godRayHit.point.x,godRayHit.point.y + 500,godRayHit.point.z);
////			Trans.rotation = Quaternion.Euler(0,0,0);
////			Cam.transform.rotation = Quaternion.Euler(90,0,0);
////			muscle.velocity = Vector3(0,-100,0);
////			vein.dead = false;
////			eye.xRot = 0;
////			eye.yRot = -90;
//			}
//		}
//	}
//
//@RPC
//function Invoke ()
//	{
//	
//	}
//
//function RequestSpawn(v : Vector3)
//	{
//	
//	}
//
//function AssignNetView(netP : NetworkPlayer)
//	{
//	netPlayer = netP;
//	}