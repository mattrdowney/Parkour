Shader "MattDowney/OneShader"
{
	Properties
	{
		_MainTex ("Base (RGB)", 2D) = "white" {}
		_Threshold ("Threshold", Float) = 0
	}
	
	SubShader
	{
		Tags { "Queue" = "Geometry+1" "RenderType" = "Transparent" }
			
		ZTest Always
		ZWrite Off
		
		CGPROGRAM
		
		#include "UnityCG.cginc"
		#pragma surface surf NoLight
		//exclude_path:prepass exclude_path:forward noambient novertexlights nolightmap nodirlightmap noforwardadd halfasview

		half4 LightingNoLight (SurfaceOutput s, half3 lightDir, half atten)
		{
			half4 c;
			c.rgb = s.Albedo;
			c.a = s.Alpha;
			return c;
		}
		
		struct Input
		{
			float2 uv_MainTex;
			float2 worldPos;
		};
		
		float _Threshold;
		
		void surf (Input IN, inout SurfaceOutput o)
		{
			o.Alpha = 0.2; //this is really the only (non-optimization) difference between Shader One and Two//
			if(IN.worldPos.y < _Threshold)
			{
				//Need to add custom fog for health
				o.Albedo = half3(1,0,0);
				}
			else
			{
				// Input: It uses uv as the random number seed.
				// Output: Random number: [0,1], that is between 0 and 1... inclusive.
				// Author: Michael Pohoreski
				// Copyright: Copyleft 2012 :-)
			
				//adapted to Unity by Matt Downey (added time-component)
			
				// We need irrationals for pseudo randomness.
				// Most (all?) known transcendental numbers will (generally) work.
				float2 r; r = float2
					(
					23.1406926327792690,  // e^pi (Gelfond's constant)
					 2.6651441426902251    // 2^sqrt(2) (Gelfond–Schneider constant)
					);
				float f; f = cos( fmod( 123456789., 1e-7 + 256. * dot(IN.uv_MainTex,r) + frac (_Time.a ) ) );
				o.Albedo = (f,f,f);
			}
		}
		ENDCG
		
		ZTest LEqual
		ZWrite On
		
		CGPROGRAM
		#pragma surface surf Lambert
	
		struct Input
		{
			float2 uv_MainTex;
			float3 worldPos;
		};
		
		sampler2D _MainTex;
		float _Threshold;
	
		void surf (Input IN, inout SurfaceOutput o)
		{
			if(IN.worldPos.y < _Threshold)
			{
				//Need to add custom fog for health
				o.Emission = half3(1,0,0);
			}
			else
			{
			half3 c;
			c = tex2D (_MainTex, IN.uv_MainTex).rgb;
			o.Albedo = c;
			}
		}
		ENDCG
	} 
	//FallBack "Diffuse"
}
