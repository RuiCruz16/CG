#ifdef GL_ES
precision highp float;
#endif

// Input vertex attributes from the application
attribute vec3 aVertexPosition;  // Position of each vertex in 3D space
attribute vec2 aTextureCoord;    // Texture coordinates for mapping textures

// Transformation matrices
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec2 vTextureCoord;

void main() {    
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    
    // Pass texture coordinates to fragment shader
    vTextureCoord = aTextureCoord;
}
