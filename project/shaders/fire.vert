#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float timeFactor;
uniform float vertexSeed;

varying vec2 vTextureCoord;
varying float vHeight;

void main() {
    vTextureCoord = aTextureCoord;
    vHeight = aVertexPosition.y;
    
    vec3 position = aVertexPosition;
    
    float normalizedHeight = position.y / 3.0;
    
    float direction = 1.0;
    
    if (normalizedHeight > 0.2 && normalizedHeight < 0.5) {
        direction = -1.0;
    } else if (normalizedHeight > 0.7) {
        direction = -1.0;
    }
    
    float waveAmplitude = 0.2 * normalizedHeight;
    
    float waveFrequency = 3.0 + normalizedHeight * 2.0;
    
    float moveFactor = min(normalizedHeight * 2.0, 1.0);
    
    float xOffset = direction * sin(timeFactor * 2.5 + vertexSeed + position.y * waveFrequency) * waveAmplitude * moveFactor;
    
    float zOffset = cos(timeFactor * 1.8 + vertexSeed * 0.7 + position.y * 2.0) * 0.1 * moveFactor;
    
    float yOffset = sin(timeFactor * 3.0 + vertexSeed * 0.5 + position.x) * 0.05 * moveFactor;
    
    position.x += xOffset;
    position.z += zOffset;
    position.y += yOffset;
    
    gl_Position = uPMatrix * uMVMatrix * vec4(position, 1.0);
}
