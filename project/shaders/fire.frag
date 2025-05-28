#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
varying float vHeight;

uniform sampler2D uFireTexture;
uniform float timeFactor;

void main() {
    vec2 animatedUV = vTextureCoord;
    animatedUV.x += sin(timeFactor * 3.0 + vTextureCoord.y * 10.0) * 0.03;
    vec4 fireColor = texture2D(uFireTexture, animatedUV);
    
    float glowIntensity = step(0.95, vHeight) * 0.25 * smoothstep(0.95, 1.0, vHeight);
    
    float flicker = 0.9 + 0.1 * sin(timeFactor * 12.0 + vHeight * 5.0);
    
    vec3 finalColor = min(fireColor.rgb + vec3(1.0, 0.5, 0.1) * glowIntensity * flicker, 1.0);
    
    gl_FragColor = vec4(finalColor, fireColor.a);
}
