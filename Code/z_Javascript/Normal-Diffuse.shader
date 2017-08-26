Shader "Custom/DistanceOnlyDiffuse"
{
	Properties
	{
	_Color ("Main Color", Color) = (1,1,1,1) //variable _Color of type Color seen as "Main Color" in the inspector
	_MainTex ("Base (RGB)", 2D) = "white" {} // Texture2D that will default to white.
	}
	
	SubShader
	{
		Tags { "RenderType"="Opaque" "Queue" = "Geometry" }
		
		CGPROGRAM // a glorified curly brace START
		#pragma surface surf Always
		//pragma definition: (computer science) A directive inserted into a computer program to prevent the automatic execution of certain error checking and reporting routines which are no longer necessary when the program has been perfected. 
		//surface--> surface shader
		//surf means use the "void surf" function defined later
		//Always means use "LightingAlways"
		
		fixed4 LightingAlways (SurfaceOutput s, fixed3 lightDir, fixed atten) 
		{
			//fixed diff = max (0, dot (s.Normal, lightDir)); //this commented out dot product normally makes things dimmer at an angle, which is normally how light works
	
			fixed4 c;
			c.rgb = s.Albedo * _LightColor0.rgb * (atten); //diff * used to be multiplied in here to dim the color of the object
			c.a = s.Alpha;
			return c;
		}

		sampler2D _MainTex; //tell the CG program code that the shaderlab code has a _MainTex and import it (in Laymans) //sampler2D is a Texture2D
		fixed4 _Color; //similarly inform the CG program that shaderlab has a property for color // color has 4 values RGBA, hence fixed (it wont change) 4

		struct Input
		{
			float2 uv_MainTex; //this is a builtin value that will be handled by unity to save you time/redundancy. other values (see: Surface Shader input structure): http://docs.unity3d.com/Documentation/Components/SL-SurfaceShaders.html
		};

		void surf (Input IN, inout SurfaceOutput o) //use the struct Input as an "IN" (input), the other stuff specifies what happens next
		{
			fixed4 c = tex2D(_MainTex, IN.uv_MainTex) * _Color; //texture the object and multiply by the color to tint it.  White color does nothing 
			o.Albedo = c.rgb; //send the calculated value back as an Albedo.  Albedo is how something would look without light
			o.Alpha = c.a;
		}
		ENDCG //glorified curly brace END
	}
	//Fallback "Transparent/VertexLit" //During developement (pre-release) graphics programmers usually comment out fallbacks to find which hardware can handle/support the shader
}
