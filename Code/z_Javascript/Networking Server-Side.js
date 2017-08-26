//#pragma strict

var isServer : boolean = false;

var Prefab : GameObject;

function Start ()
	{
	Network.InitializeSecurity();
	Network.incomingPassword = "TactiKill";
	Network.InitializeServer(10,25000,true);
	}
	
function OnPlayerConnected (player)
	{
	Debug.Log("Welcome To Tachycardia");
	Network.Instantiate(Prefab,Vector3.zero, Quaternion.identity, 0);
	}
	
function OnServerInitialized ()
	{
	Debug.Log("Server initialized and ready");
	}
	
function OnConnectedToServer ()
	{
	Debug.Log("Sucessfully connected to server.");
	}

function OnPlayerDisconnected (player)
	{
	Debug.Log("Clean up after player " +  player);
    Network.RemoveRPCs(player);
    Network.DestroyPlayerObjects(player);
    Network.Destroy(GetComponent(player).viewID);
	}
	
function OnDisconnectedFromServer(info : NetworkDisconnection)
	{
    if (Network.isServer)
    	{
        Debug.Log("Local server connection disconnected");
    	}
    else
    	{
        if (info == NetworkDisconnection.LostConnection)
        			Debug.Log("Lost connection to the server");
        else
            		Debug.Log("Successfully diconnected from the server");
    	}
	}    
	
function OnFailedToConnect (error)
	{
	Debug.Log("Could not connect to server: " + error);
	}

function OnNetworkInstantiate (info)
	{
	Debug.Log("New object instantiated by " + info.sender);
	}
	
function OnSerializeNetworkView (bitstream, info)
	{
	
	}
	
	