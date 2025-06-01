#ifdef GL_ES
precision highp float;
#endif

// Input variables from vertex shader
varying vec3 vNormal;    // Transformed normal vector (for lighting)
varying vec3 vEyeVec;    // View vector (from vertex to camera)

// Input uniforms from application
uniform float uTimeFactor;       // Time variable for animations
uniform int uManeuverType;       // Helicopter state: 0=stationary, 1=taking off, 2=landing
uniform vec4 uBaseColor;         // Base color of the heliport lights
uniform vec4 uEmissiveColor;     // Emissive color for glow effect (unused in this implementation)

void main() {
    // Normalize vectors for lighting calculation
    vec3 N = normalize(vNormal);     // Surface normal
    vec3 E = normalize(vEyeVec);     // View direction
    
    // Calculate reflection vector for specular highlights
    vec3 R = reflect(-E, N);
    
    // Initialize pulse intensity (used for light blinking)
    float pulseIntensity = 0.0;
    
    // Only apply pulsing effect if helicopter is taking off or landing
    if (uManeuverType > 0) {
        // Create sinusoidal pulse that varies between 0.5 and 1.0
        pulseIntensity = 0.5 + 0.5 * sin(uTimeFactor * 6.28); // 6.28 ≈ 2π
    }
    
    // Initialize final color
    vec4 finalColor;
    
    // Choose appropriate color based on maneuver type
    if (uManeuverType == 1) {
        // Taking off: use orange warning lights
        vec4 orangeColor = vec4(1.0, 0.6, 0.2, 1.0);
        // Mix base color with orange based on pulse intensity
        finalColor = mix(uBaseColor, orangeColor, pulseIntensity);
    } else if (uManeuverType == 2) {
        // Landing: use green indicator lights
        vec4 greenColor = vec4(0.2, 0.8, 0.2, 1.0);
        // Mix base color with green based on pulse intensity
        finalColor = mix(uBaseColor, greenColor, pulseIntensity);
    } else {
        // Stationary: use base color
        finalColor = uBaseColor;
    }
    
    // Calculate specular highlight based on view and reflection vectors
    // Highlight intensity is modulated by pulse intensity for dynamic effect
    float specular = pow(max(dot(R, E), 0.0), 20.0) * pulseIntensity;
    
    // Add specular component to final color
    finalColor.rgb += vec3(specular);
    
    // Output final color
    gl_FragColor = finalColor;
}