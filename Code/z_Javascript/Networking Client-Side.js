#pragma strict

var Player : GameObject;

function Start ()
	{
	
	}
	
function OnPlayerConnected (player)
	{
	Network.Instantiate(Player,Vector3.zero, Quaternion.identity, 0);
	}
	
function OnServerInitialized ()
	{
	Debug.Log("Server initialized and ready");
	}
	
function OnConnectedToServer ()
	{
	
	}

function OnPlayerDisconnected (player)
	{
	
	}
	
function OnDisconnectedFromServer (mode)
	{
	
	}
	
function OnFailedToConnect (error)
	{
	
	}

function OnNetworkInstantiate (info)
	{
	
	}
	
function OnSerializeNetworkView (bitstream, info)
	{
	
	}
	
	