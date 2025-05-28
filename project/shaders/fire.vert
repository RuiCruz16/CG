#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
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
    
    if (position.y > 0.1) {
        float offset = vertexSeed * 0.01;
        
        float xWave = sin(timeFactor * 3.0 + offset + position.y * 0.5) * position.y * 0.2;
        
        float zWave = cos(timeFactor * 2.5 + offset * 1.5 + position.y * 0.7) * position.y * 0.15;
        
        float yWave = sin(timeFactor * 4.0 + offset * 2.0) * 0.05 * position.y;
        
        position.x += xWave;
        position.z += zWave;
        position.y += yWave;
    }
    
    gl_Position = uPMatrix * uMVMatrix * vec4(position, 1.0);
}
