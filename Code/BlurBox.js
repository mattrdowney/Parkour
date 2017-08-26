#pragma strict

function FixedUpdate ()
	{
	if(Input.GetButtonDown("Jump"))
		{
		var w : Vector3 = Random.onUnitSphere;
		var d : Vector3 = w.normalized;

    	var m : Mesh = GetComponent(MeshFilter).mesh;
    
    	var o : int;
    	o = m.vertexCount;
    
    
    	var v : Vector3[] = new Vector3[o];
    	v = m.vertices;
    
    	var n : Vector3[] = new Vector3[o];
    	n = m.normals;
    
		var i : int;
		var x : int;
		
    	for (i = 0; i < o; i++)
    		{
    		if(d.x*n[i].x + d.y*n[i].y + d.z*n[i].z > 0)
    			{
    	    	v[i] += w;
    	    	}
       		}
    	m.vertices = v;
    	}
	}

//function Update ()
//	{
//	if(Input.GetButtonDown("Jump"))
//		{
//	var velocity : Vector3 = Vector3(1,1,1);
//	var direction : Vector3 = velocity.normalized;
//    var mesh : Mesh = GetComponent(MeshFilter).mesh;
//    var vertices : Vector3[] = mesh.vertices;
//    var normals : Vector3[] = mesh.normals;
//
//	var i : int;
//	var p : int;
//	var l : int;
//	var x : int;
//    for (i = 0; i < vertices.Length; i++)
//    	{
//    	if(Vector3.Dot(direction,normals[i]) > 0.01)
//    		{
//        	p++;
//        	}
//        }
//    
//    l = p;
//    
//    if(p > 0)
//    	{
//    	var points : Vector3[] = new Vector3[p];
//    
//    	for (i = 0; i < vertices.Length; i++)
//    		{
//    		if(Vector3.Dot(direction,normals[i]) > 0.01)
//    			{
//        		points[p-1] = vertices[i];
//        		p--;
//        		}
//			}
//			    
//    	for (i = 0; i < vertices.Length; i++)
//    		{
//    		for (x = 0; x < l; x++)
//				{
//				if(points[x] == vertices[i] && points[x].y == vertices[i].y && points[x].z == vertices[i].z)
//					{
//					vertices[i] += velocity;
//					}
//				}
//			}
//   	 	mesh.vertices = vertices;
//   	 	}
// 
// 	}
//	}