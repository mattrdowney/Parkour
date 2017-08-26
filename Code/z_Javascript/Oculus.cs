using UnityEngine;
using System.Collections;

public class Oculus : MonoBehaviour {

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}
	
	char CompressAngle(float angle)
	{
		float temp = angle * 0.711111f;
		if(temp > 255.644f) temp = 0f;
		temp = Mathf.Round(temp);
		return (char) temp;
	}
	
	float DecompressAngle(char rot)
	{
		return (char) (rot*1.40625f);
	}
}
