class mirrorObjs extends Editor
	{
	@MenuItem("Edit/Tile")
    static function Tile(command : MenuCommand)
    	{
    	var tileLength : int = 3;
		var mapHeight : float = 200;
		var mapWidth : float = 200;
		var mapAltitude : float = 1000;
		var _180 : float = 180;
		
    	//Make sure the center tile (1) will have evenly distributed tiles on each side (2n) aka [2n + 1] aka ODD 
    	if(tileLength % 2 == 0 && tileLength > 0) {Debug.LogError("Currently an even/zero/negative number of tiles, try odd/non-zero/positive"); return;}
    	
    	//This makes EVERYTHING//
        for(var c : int = 0; c < Selection.transforms.Length; c++)
        	{
        	Debug.Log(c);
            var obj : GameObject;
            obj = Selection.gameObjects[c];
            
            var normal : Transform;
        	normal = Instantiate(obj.transform);
        	
        	var mirror : Transform;
            mirror = Instantiate(normal);
            mirror.RotateAround(Vector3.zero,Vector3.up,_180);
            
            //find the mas distance away from the center segment
            var x : float;
            var z : float;
            
            z = -1.0f*(tileLength - 1)/2; //a confusing optimization
            
            x = z*mapWidth;
            z *= mapHeight;
            
            var tx : float;
            var tz : float;
            var ty : float;
            
            tx = x;
            ty = mapAltitude;
            
            //Start//
            for(var i : int = 0; i < 2*tileLength; i++)
            	{
            	if(i == tileLength) { tx = x; ty = -mapAltitude; }
            	tz = z; 
            	for(var j : int = 0; j < tileLength; j++)
            		{
            		var real : boolean;
            		if((i + j) % 2 == 0) real = true;
            		else real = false;
            		
            		if(real) Instantiate(obj,normal.position + Vector3(tx,ty,tz),normal.rotation);
            		else     Instantiate(obj,mirror.position + Vector3(tx,ty,tz),mirror.rotation);
            		
            		tz += mapHeight;
            		}
            	tx += mapWidth;
            	}
            
            //Clean Up//
            obj = null;
            DestroyImmediate(mirror.gameObject);
            DestroyImmediate(normal.gameObject);
            //END//
            }
        for(var w : int = Selection.transforms.Length - 1; w > -1; w--)
        	{
        	DestroyImmediate(Selection.gameObjects[w]);
        	}
    	}
    }