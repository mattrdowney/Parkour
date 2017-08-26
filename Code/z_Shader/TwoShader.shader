Shader "MattDowney/TwoShader"
{
	Properties
	{
		_MainTex ("Base (RGB)", 2D) = "white" {}
		_Threshold ("Threshold", Float) = 0
	}
	
	SubShader
	{
		Tags { "Queue" = "Geometry+1" "RenderType" = "Opaque" }
		
		ZTest Always
		ZWrite Off
		
		CGPROGRAM
		
		#include "UnityCG.cginc"
		#pragma surface surf NoLight exclude_path:prepass noambient novertexlights nolightmap nodirlightmap noforwardadd halfasview
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
		};
		
		void surf (Input IN, inout SurfaceOutput o)
		{
			//Author: Michael Pohoreski
			//adapted to Unity by Matt Downey (added fractional time-component for extra time-based randomness)
			
			float2 r; r = float2
				(
				23.1406926327792690,  // e^pi (Gelfond's constant)
				 2.6651441426902251   // 2^sqrt(2) (Gelfond–Schneider constant)
				);
			float f; f = cos( fmod( 123456789., 1e-7 + 256. * dot(IN.uv_MainTex,r) + frac (_Time.a ) ) );
			f += 0.15;
			f = saturate(f);
			o.Emission = half3(f,f,f); //electric yellow (255,255,51) (1,1,.2)
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
			if(IN.worldPos.y > _Threshold)
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
