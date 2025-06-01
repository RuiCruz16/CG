#ifdef GL_ES
precision highp float;
#endif

// Input vertex attributes from the application
attribute vec3 aVertexPosition; // Vertex position in 3D space
attribute vec3 aVertexNormal;   // Normal vector for lighting
attribute vec2 aTextureCoord;   // Texture coordinates for mapping textures

// Transformation matrices
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec3 vNormal;
varying vec3 vEyeVec;
varying vec2 vTextureCoord;

void main() {
    // Transform vertex position from model space to view space
    vec4 vertex = uMVMatrix * vec4(aVertexPosition, 1.0);
    
    // Calculate vector from vertex to camera
    // Negative because in view space, camera is at origin looking in -Z direction
    vEyeVec = -vec3(vertex.xyz);
    
    // Transform normal vector from model space to view space using the normal matrix
    vNormal = vec3(uNMatrix * vec4(aVertexNormal, 0.0));
    
    // Pass texture coordinates to fragment shader
    vTextureCoord = aTextureCoord;
    
    gl_Position = uPMatrix * vertex;
}
