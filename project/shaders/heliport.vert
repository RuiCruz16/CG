#ifdef GL_ES
precision highp float;
#endif

// Input vertex attributes from the application
attribute vec3 aVertexPosition;  // Position of each vertex in 3D space
attribute vec2 aTextureCoord;    // Texture coordinates for mapping textures

// Transformation matrices passed from application
uniform mat4 uMVMatrix;   // Model-View matrix (combines model and camera transformations)
uniform mat4 uPMatrix;    // Projection matrix (perspective/orthographic projection)

// Output variables to pass to fragment shader
varying vec2 vTextureCoord;  // Texture coordinates passed through

void main() {    
    // Transform vertex position from model space to clip space
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    
    // Pass texture coordinates unchanged to fragment shader
    vTextureCoord = aTextureCoord;
}
