//class TileWorld extends Editor
//    	{
//    	@MenuItem("Edit/Tile")
//        static function Tile(command : MenuCommand)
//        	{
//        	var tileLength : int = 3;
//    		var mapHeight : float = 5000;
//    		var mapWidth : float = 5000;
//    		
//        	//Make sure the center tile (1) will have evenly distributed tiles on each side (2n) aka [2n + 1] aka ODD 
//        	if(tileLength % 2 == 0 || tileLength < 1)
//        	{
//        		Debug.LogError("Currently an even/zero/negative number of tiles, try an odd/non-zero/positve number");
//        		return; //Important!
//        	}
//        	
//        	//This makes EVERYTHING//
//            for(var c : int = 0; c < Selection.transforms.Length; c++) //cycle through all selected gameobjects.
//            	{
//            	//Debug.Log(c);
//                var obj : GameObject;
//                obj = Selection.gameObjects[c];
//                
//                var normal : Transform; //The transform being manipulated
//            	normal = Instantiate(obj.transform);
//                
//                //find the max distance away from the center segment
//                var x : float;
//                var z : float;
//                
//                x = mapWidth*-1.0f*(tileLength - 1)/2; //start in South-West corner of the map (-x,-z as viewed from the sky)
//                z = mapHeight*-1.0f*(tileLength - 1)/2;
//                
//                var tx : float;
//                var tz : float;
//                
//                tx = x;
//                
//                //Start//
//                for(var i : int = 0; i < tileLength; i++)
//                	{
//                	tz = z; 
//                	for(var j : int = 0; j < tileLength; j++)
//                		{
//                		if(i == tileLength - (tileLength - 1)/2 - 1)
//           				{
//                			if(j == i)
//                			{
//                				//Debug.Log(i + " " + j);
//                				tz += mapHeight;
//                				continue;
//                			}
//                		}
//                		Instantiate(obj,normal.position + Vector3(tx,0,tz),normal.rotation);
//                		
//                		tz += mapHeight;
//                		}
//                	tx += mapWidth;
//                	}
//                
//                //Clean Up//
//                obj = null;
//                DestroyImmediate(normal.gameObject);
//                //END//
//                }
//        	}
//        }