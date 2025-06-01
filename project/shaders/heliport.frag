#ifdef GL_ES
precision highp float;
#endif

// Input variables from vertex shader
varying vec2 vTextureCoord;  // Texture coordinates

// Input uniforms from application
uniform sampler2D uSampler;      // Base "H" texture for heliport
uniform sampler2D uSamplerAlt;   // Alternative texture ("UP" or "DOWN")
uniform float uTimeFactor;
uniform int uManeuverType;       // Helicopter state: 0=stationary, 1=taking off, 2=landing

void main() {
    // Sample both textures
    vec4 baseColor = texture2D(uSampler, vTextureCoord);     // H texture
    vec4 altColor = texture2D(uSamplerAlt, vTextureCoord);   // UP/DOWN texture
    
    if (uManeuverType == 0) {
        // Stationary: show "H" texture
        gl_FragColor = baseColor;
    } else {
        // Create animation cycle based on time
        // mod(uTimeFactor, 1.0): Keeps the value of uTimeFactor within the range [0, 1]
        float cycle = mod(uTimeFactor, 1.0);
        
        if (cycle < 0.10) {
            // First 10%: show "H" texture
            gl_FragColor = baseColor;
        } 
        else if (cycle < 0.50) {
            // Next 40%: transition from "H" to "UP/DOWN"
            // smoothstep gradually transitions from 0 to 1 as cycle moves between 0.10 and 0.50
            float transitionFactor = smoothstep(0.10, 0.50, cycle);
            // mix() blends baseColor and altColor based on transitionFactor
            gl_FragColor = mix(baseColor, altColor, transitionFactor);
        } 
        else if (cycle < 0.60) {
            // Next 10%: show "UP/DOWN" texture fully
            gl_FragColor = altColor;
        } 
        else {
            // Final 40%: transition back to "H"
            float transitionFactor = smoothstep(0.60, 1.0, cycle);
            gl_FragColor = mix(altColor, baseColor, transitionFactor);
        }
    }
}
