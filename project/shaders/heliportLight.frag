#ifdef GL_ES
precision highp float;
#endif

varying vec3 vNormal;
varying vec3 vEyeVec;

uniform float uTimeFactor;
uniform int uManeuverType;
uniform vec4 uBaseColor;
uniform vec4 uEmissiveColor;

void main() {
    vec3 N = normalize(vNormal);
    vec3 E = normalize(vEyeVec);
    
    vec3 R = reflect(-E, N);
    
    float pulseIntensity = 0.0;
    
    if (uManeuverType > 0) {
        pulseIntensity = 0.5 + 0.5 * sin(uTimeFactor * 6.28);
    }
    
    vec4 finalColor;
    
    if (uManeuverType == 1) {
        finalColor = mix(uBaseColor, uEmissiveColor, pulseIntensity);
    } else if (uManeuverType == 2) {
        finalColor = mix(uBaseColor, vec4(1.0, 0.2, 0.2, 1.0), pulseIntensity);
    } else {
        finalColor = uBaseColor;
    }
    
    float specular = pow(max(dot(R, E), 0.0), 20.0) * pulseIntensity;
    finalColor.rgb += vec3(specular);
    
    gl_FragColor = finalColor;
}
