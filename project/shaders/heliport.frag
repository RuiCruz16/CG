#ifdef GL_ES
precision highp float;
#endif

// Input variables from vertex shader
varying vec2 vTextureCoord;  // Texture coordinates

// Input uniforms from application
uniform sampler2D uSampler;      // Base "H" texture for heliport
uniform sampler2D uSamplerAlt;   // Alternative texture ("UP" or "DOWN") based on maneuver
uniform float uTimeFactor;       // Time variable for animations
uniform int uManeuverType;       // Helicopter state: 0=stationary, 1=taking off, 2=landing

void main() {
    // Sample both textures at the current texture coordinate
    vec4 baseColor = texture2D(uSampler, vTextureCoord);     // H texture
    vec4 altColor = texture2D(uSamplerAlt, vTextureCoord);   // UP/DOWN texture
    
    if (uManeuverType == 0) {
        // If helicopter is stationary, just show the H texture
        gl_FragColor = baseColor;
    } else {
        // Create a repeating cycle from 0.0 to 1.0 based on time
        float cycle = mod(uTimeFactor, 1.0);
        
        if (cycle < 0.10) {
            // First 10% of cycle: show H texture
            gl_FragColor = baseColor;
        } 
        else if (cycle < 0.50) {
            // Next 40% of cycle: smoothly transition from H to UP/DOWN
            // smoothstep creates an S-curve transition from 0 to 1
            float transitionFactor = smoothstep(0.10, 0.50, cycle);
            // mix() linearly interpolates between baseColor and altColor based on factor
            gl_FragColor = mix(baseColor, altColor, transitionFactor);
        } 
        else if (cycle < 0.60) {
            // Next 10% of cycle: show UP/DOWN texture fully
            gl_FragColor = altColor;
        } 
        else {
            // Final 40% of cycle: smoothly transition back to H
            float transitionFactor = smoothstep(0.60, 1.0, cycle);
            gl_FragColor = mix(altColor, baseColor, transitionFactor);
        }
    }
}
