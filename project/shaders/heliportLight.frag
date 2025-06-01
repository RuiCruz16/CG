#ifdef GL_ES
precision highp float;
#endif

// Input variables from vertex shader
varying vec3 vNormal;    // Normal vector for lighting
varying vec3 vEyeVec;    // View vector (vertex to camera)

// Input uniforms from application
uniform float uTimeFactor;
uniform int uManeuverType;
uniform vec4 uBaseColor;         // Base color of the heliport lights
uniform vec4 uEmissiveColor;     // Emissive color for glow effect

void main() {
    // Normalize vectors for lighting calculations
    vec3 N = normalize(vNormal);     // Surface normal
    vec3 E = normalize(vEyeVec);     // View direction
    
    // Calculate reflection vector for specular highlights
    vec3 R = reflect(-E, N);
    
    // Pulse intensity for blinking lights (varies sinusoidally)
    float pulseIntensity = 0.0;
    
    // Only apply pulsing effect if helicopter is taking off or landing
    if (uManeuverType > 0) {
        pulseIntensity = 0.5 + 0.5 * sin(uTimeFactor * 6.25);
    }
    
    vec4 finalColor;
    
    if (uManeuverType == 1) {
        // Orange for takeoff
        vec4 orangeColor = vec4(1.0, 0.6, 0.2, 1.0);
        finalColor = mix(uBaseColor, orangeColor, pulseIntensity);
    } else if (uManeuverType == 2) {
        // Green for landing
        vec4 greenColor = vec4(0.2, 0.8, 0.2, 1.0);
        finalColor = mix(uBaseColor, greenColor, pulseIntensity);
    } else {
        finalColor = uBaseColor;
    }
    
    // Add specular highlights modulated by pulse intensity
    float specular = pow(max(dot(R, E), 0.0), 20.0) * pulseIntensity;
    finalColor.rgb += vec3(specular);
    
    gl_FragColor = finalColor;
}
