#ifdef GL_ES
precision highp float;
#endif

// Input vertex attributes from the application
attribute vec3 aVertexPosition; // Position of each vertex in 3D space
attribute vec3 aVertexNormal;   // Normal vector for lighting calculations
attribute vec2 aTextureCoord;   // Tecture coordinates for mapping textures

// Transformation matrices passed from application
uniform mat4 uMVMatrix;   // Model-View matrix (combines model and camera transformations)
uniform mat4 uPMatrix;    // Projection matrix (perspective/orthographic projection)
uniform mat4 uNMatrix;    // Normal matrix (transforms normals correctly when model is scaled)

// Output variables to pass to fragment shader
varying vec3 vNormal;   // Transformed normal vector
varying vec3 vEyeVec;   // View vector (from vertex to camera)
varying vec2 vTextureCoord; // Texture cordinates passed through

void main() {
    // Transform vertex position from model space to view space
    vec4 vertex = uMVMatrix * vec4(aVertexPosition, 1.0);
    
    // Calculate vector from vertex to camera
    // Negative because in view space, camera is at origin looking in -Z direction
    vEyeVec = -vec3(vertex.xyz);
    
    // Transform normal vector from model space to view space
    // Use normal matrix for correct transformation
    vNormal = vec3(uNMatrix * vec4(aVertexNormal, 0.0));
    
    // Pass texture coordinates to fragment shader
    vTextureCoord = aTextureCoord;
    
    // Transform vertex position to clip space for rendering
    gl_Position = uPMatrix * vertex;
}
