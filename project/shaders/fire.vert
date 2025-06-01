#ifdef GL_ES
precision highp float;
#endif

// Input vertex attributes from the application
attribute vec3 aVertexPosition;  // Position of each vertex in 3D space
attribute vec2 aTextureCoord;    // Texture coordinates for mapping textures

// Transformation matrices and animation parameters
uniform mat4 uMVMatrix;    // Model-View matrix
uniform mat4 uPMatrix;     // Projection matrix
uniform float timeFactor;  // Time variable for animation
uniform float vertexSeed;  // Randomization seed for varied flame movement

// Output variables to pass to fragment shader
varying vec2 vTextureCoord;  // Texture coordinates
varying float vHeight;       // Normalized height of vertex in flame

void main() {
    // Pass texture coordinates to fragment shader
    vTextureCoord = aTextureCoord;
    
    // Pass vertex height to fragment shader for height-based effects
    vHeight = aVertexPosition.y;
    
    // Start with the original vertex position
    vec3 position = aVertexPosition;
    
    // Normalize height to 0-1 range (assuming flame height is 3.0)
    float normalizedHeight = position.y / 3.0;
    
    // Determine movement direction based on height in flame
    // Creates more natural-looking fire movement
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
    
    // Movement factor increases with height up to a maximum of 1.0
    float moveFactor = min(normalizedHeight * 2.0, 1.0);
    
    // Calculate horizontal (x) offset using a sine wave
    // Variables create complex movement pattern unique to each vertex
    float xOffset = direction * sin(timeFactor * 2.5 + vertexSeed + position.y * waveFrequency) * waveAmplitude * moveFactor;
    
    // Calculate depth (z) offset using a cosine wave with different parameters
    float zOffset = cos(timeFactor * 1.8 + vertexSeed * 0.7 + position.y * 2.0) * 0.1 * moveFactor;
    
    // Calculate small vertical (y) displacement for more organic movement
    float yOffset = sin(timeFactor * 3.0 + vertexSeed * 0.5 + position.x) * 0.05 * moveFactor;
    
    // Apply the calculated offsets to the vertex position
    position.x += xOffset;
    position.z += zOffset;
    position.y += yOffset;
    
    // Transform the modified position to clip space for rendering
    gl_Position = uPMatrix * uMVMatrix * vec4(position, 1.0);
}