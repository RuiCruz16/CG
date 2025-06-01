#ifdef GL_ES
precision highp float;
#endif

// Input vertex attributes from the application
attribute vec3 aVertexPosition;  // Position of each vertex in 3D space
attribute vec2 aTextureCoord;    // Texture coordinates for mapping textures

// Transformation matrices and animation parameters
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float timeFactor;
uniform float vertexSeed;

varying vec2 vTextureCoord;
varying float vHeight;

void main() {
    // Pass texture coordinates and height to fragment shader
    vTextureCoord = aTextureCoord;
    vHeight = aVertexPosition.y;
    
    // Start with the original vertex position
    vec3 position = aVertexPosition;
    
    float normalizedHeight = position.y / 3.0;
    
    // Determine movement direction based on height
    float direction = 1.0;
    
    if (normalizedHeight > 0.2 && normalizedHeight < 0.5) {
        direction = -1.0;  // Middle-lower section moves opposite
    } else if (normalizedHeight > 0.7) {
        direction = -1.0;  // Upper section moves opposite too
    }
    
    // Wave amplitude increases with height (stronger at top of flame)
    float waveAmplitude = 0.2 * normalizedHeight;
    
    // Wave frequency increases with height (faster oscillation higher up)
    float waveFrequency = 3.0 + normalizedHeight * 2.0;
    
    // Calculate movement factor (stronger at higher positions)
    float moveFactor = min(normalizedHeight * 2.0, 1.0);
    
    // Apply sine and cosine waves for dynamic movement
    float xOffset = direction * sin(timeFactor * 2.5 + vertexSeed + position.y * waveFrequency) * waveAmplitude * moveFactor;
    float zOffset = cos(timeFactor * 1.8 + vertexSeed * 0.7 + position.y * 2.0) * 0.1 * moveFactor;
    float yOffset = sin(timeFactor * 3.0 + vertexSeed * 0.5 + position.x) * 0.05 * moveFactor;
    
    // Modify vertex position with calculated offsets
    position.x += xOffset;
    position.z += zOffset;
    position.y += yOffset;
    
    gl_Position = uPMatrix * uMVMatrix * vec4(position, 1.0);
}
