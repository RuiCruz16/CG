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
    // Animate texture coordinates using a sine wave
    vec2 animatedUV = vTextureCoord;
    animatedUV.x += sin(timeFactor * 3.0 + vTextureCoord.y * 10.0) * 0.03;

    // Sample the fire texture
    vec4 fireColor = texture2D(uFireTexture, animatedUV);
    
    // Add glow effect near the top of the flame
    // step(0.95, vHeight): Activates the glow only for heights above 0.95
    // smoothstep(0.95, 1.0, vHeight): Gradually increases the glow intensity as the height approaches 1.0
    float glowIntensity = step(0.95, vHeight) * 0.25 * smoothstep(0.95, 1.0, vHeight);
   
    // Add flickering effect based on time and height
    float flicker = 0.9 + 0.1 * sin(timeFactor * 12.0 + vHeight * 5.0);
    
    // Combine fire color with glow and flicker
    // min() prevents colors from exceeding 1.0
    vec3 finalColor = min(fireColor.rgb + vec3(1.0, 0.5, 0.1) * glowIntensity * flicker, 1.0);
    
    // Output final color, preserving the original alpha for transparency
    gl_FragColor = vec4(finalColor, fireColor.a);
}
