#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;      // Base "H" texture
uniform sampler2D uSamplerAlt;   // "UP" or "DOWN" texture based on maneuver
uniform float uTimeFactor;
uniform int uManeuverType;       // 0: stationary, 1: taking off, 2: landing

void main() {
    vec4 baseColor = texture2D(uSampler, vTextureCoord);
    vec4 altColor = texture2D(uSamplerAlt, vTextureCoord);
    
    if (uManeuverType == 0) {
        gl_FragColor = baseColor;
    } else {
        float cycle = mod(uTimeFactor, 1.0);
        
        if (cycle < 0.10) {
            // Brief static period for H
            gl_FragColor = baseColor;
        } 
        else if (cycle < 0.50) {
            // Long smooth transition from H to UP/DOWN
            float transitionFactor = smoothstep(0.10, 0.50, cycle);
            gl_FragColor = mix(baseColor, altColor, transitionFactor);
        } 
        else if (cycle < 0.60) {
            // Brief static period for UP/DOWN
            gl_FragColor = altColor;
        } 
        else {
            // Long smooth transition back to H
            float transitionFactor = smoothstep(0.60, 1.0, cycle);
            gl_FragColor = mix(altColor, baseColor, transitionFactor);

        }
    }
}
