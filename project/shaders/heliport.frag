#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D uSamplerAlt;
uniform float uTimeFactor;
uniform int uManeuverType;

void main() {
    float blink = step(0.5, fract(uTimeFactor));
    
    if (uManeuverType == 0) {
        gl_FragColor = texture2D(uSampler, vTextureCoord);
    } else {
        if (blink < 0.5) {
            gl_FragColor = texture2D(uSampler, vTextureCoord);
        } else {
            gl_FragColor = texture2D(uSamplerAlt, vTextureCoord);
        }
    }
}
