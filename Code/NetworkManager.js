//var gameName : String = "Matthew_Russell_Downey";
//var demigod : GameObject;
//
//private var buttonX : float;
//private var buttonY : float;
//private var buttonW : float;
//private var buttonH : float;
//private var buttonMargin : float = 5;
//
//private var hostData : HostData[];
//private var refreshing : boolean;
//
//private var viewID : NetworkViewID;
//
//function Start ()
//	{
//	buttonX = Screen.width*0.05;
//	buttonY = Screen.height*0.05;
//	buttonW = 100;
//	buttonH = 22;
//	}
//	
//function OnServerInitialized ()
//	{
//	Debug.Log("Server Initialized!");
//	}
//
//function OnMasterServerEvent (mse : MasterServerEvent)
//	{
//	if(mse == MasterServerEvent.RegistrationSucceeded) Debug.Log("Connected to MasterServer!");
//	}
//
//function OnPlayerConnected (player : NetworkPlayer)
//	{
//	if(!Network.isServer && player == Network.player)
//		{
//		viewID = Network.AllocateViewID();
//		clone.networkView.viewID = viewID;
//		}
//	}
//	
//function OnSerializeNetworkView (stream,info)
//	{
//	var vID : NetworkViewID = viewID;
//	
//	//the player will tell the server through which socket he wants to send info on his player 
//	if(stream.isWriting && !Network.isServer) //minute (my-newt) optimization! (loti)
//		{
//		stream.Serialize(vID);
//		}
//	
//	//the server uses the player-given information to communicate with the player's
//	else if(Network.isServer && stream.isReading) //another minute (my-newt) optimization! (coti)
//		{
//		var vID : NetworkViewID;
//		stream.Serialize(vID);
//		viewID = vID;
//		}
//	}
//
//function OnGUI ()
//	{
//	if(!Network.isClient && !Network.isServer)
//		{
//		if(GUI.Button(Rect(buttonX,buttonY,buttonW,buttonH), "Start Server"))
//			{
//			Debug.Log("Starting Server");
//			StartServer();
//			}
//		if(GUI.Button(Rect(buttonX,buttonY + buttonMargin + buttonH,buttonW,buttonH), "Refresh Hosts"))
//			{
//			Debug.Log("Refreshing");
//			RefreshHostList();
//			}
//		if(hostData)
//			{
//			for(var i : int;i < hostData.length; i++)
//				{
//				if(GUI.Button(Rect(buttonX + buttonW + buttonMargin,buttonY + (buttonH + buttonMargin)*i,buttonW,buttonH), hostData[i].gameName))
//					{
//					Network.Connect(hostData[i]);
//					}
//				}
//			}
//		}
//	}
//
//function Update ()
//	{
//	if(refreshing)
//		{
//		if(MasterServer.PollHostList().Length > 0)
//			{
//			Debug.Log(MasterServer.PollHostList().Length);
//			refreshing = false;
//			hostData = MasterServer.PollHostList();
//			}
//		}
//	}
//	
//function StartServer ()
//	{
//	Network.InitializeSecurity();
//	Network.InitializeServer(16,25001,!Network.HavePublicAddress);
//	MasterServer.RegisterHost(gameName,"Parkour","Still Testing");
//	}
//
//function RefreshHostList ()
//	{
//	MasterServer.RequestHostList(gameName);
//	refreshing = true;
//	}
//
//@RPC
//function HellSpawn (position : Vector2)
//	{
//	if(Network.isServer)
//		{
//		Instantiate(demigod,Vector3(position.x,2000,position.z),Quaternion.Euler(0,90,0));
//		}
//	else EnforcePenalty();
//	}
//
//function LocalHellSpawn (position : Vector2)
//	{
//	Instantiate(demigod,Vector3(position.x,2000,position.z),Quaternion.Euler(0,90,0));
//	}
//	
//function EnforcePenalty()
//	{
//	Debug.Log("Something is terribly, terribly wrong");
//	}