#ifdef GL_ES
precision highp float;
#endif

// Input variables from vertex shader
varying vec2 vTextureCoord;  // Texture coordinates
varying float vHeight;       // Vertex height (used for fire effect)

// Input uniforms from application
uniform sampler2D uFireTexture;  // Base fire texture image
uniform float timeFactor;        // Time variable for animation


void main() {
    // Create animated texture coordinates by offsetting the x-coordinate
    // based on a sine wave that varies with time and y-position
    vec2 animatedUV = vTextureCoord;
    animatedUV.x += sin(timeFactor * 3.0 + vTextureCoord.y * 10.0) * 0.03;

    // Sample the fire texture with animated coordinates
    vec4 fireColor = texture2D(uFireTexture, animatedUV);
    
    // Create a glow effect at the top of the flame (where height > 0.95)
    // step(0.95, vHeight) returns 1 if vHeight > 0.95, otherwise 0
    // smoothstep blends between edges for a softer transition
    float glowIntensity = step(0.95, vHeight) * 0.25 * smoothstep(0.95, 1.0, vHeight);
   
    // Create flickering effect that varies with time and height
    float flicker = 0.9 + 0.1 * sin(timeFactor * 12.0 + vHeight * 5.0);
    
    // Combine the base fire color with an orange-yellow glow
    // and apply the flickering effect
    // min() prevents colors from exceeding 1.0
    vec3 finalColor = min(fireColor.rgb + vec3(1.0, 0.5, 0.1) * glowIntensity * flicker, 1.0);
    
    // Output final color, preserving the original alpha for transparency
    gl_FragColor = vec4(finalColor, fireColor.a);
}
