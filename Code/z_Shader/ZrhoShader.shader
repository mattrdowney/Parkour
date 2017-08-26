Shader "MattDowney/ZrhoShader"
{
	Properties
	{
		_MainTex ("Base (RGB)", 2D) = "white" {}
		_Threshold ("Threshold", Float) = 0
	}
	
	SubShader
	{
		Tags { "Queue" = "Geometry+1" "RenderType" = "Opaque" }
		
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
