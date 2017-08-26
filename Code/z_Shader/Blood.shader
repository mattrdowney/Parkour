Shader "Blood"
{
	Properties
	{
		_MainTex ("Base (RGB)", 2D) = "white" {}
		_Threshold ("Threshold", Float) = 0
	}
	SubShader
	{
		Tags { "RenderType"="Opaque" }
		
		ZWrite Off
		
		CGPROGRAM
		#pragma surface surf Lambert

		struct Input
		{
			float3 worldPos;
		};
		
		float _Threshold;

		void surf (Input IN, inout SurfaceOutput o)
		{
			clip(_Threshold - IN.worldPos.y);
			o.Emission = half3(0.6,0,0);
		}
		ENDCG
	} 
	//FallBack "Diffuse"
}
