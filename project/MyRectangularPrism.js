import { CGFobject } from "../lib/CGF.js";

export class MyRectangularPrism extends CGFobject {
    constructor(scene, length, height, width) {
        super(scene);
        this.length = length;
        this.height = height;
        this.width = width;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
    
        const halfLength = this.length / 2;
        const halfHeight = this.height / 2;
        const halfWidth = this.width / 2;
    
        // Define the 8 vertices for the rectangular prism
        this.vertices = [
            -halfLength, -halfHeight, -halfWidth,  // Vertex 0
            halfLength, -halfHeight, -halfWidth,   // Vertex 1
            halfLength, halfHeight, -halfWidth,    // Vertex 2
            -halfLength, halfHeight, -halfWidth,   // Vertex 3
            -halfLength, -halfHeight, halfWidth,   // Vertex 4
            halfLength, -halfHeight, halfWidth,    // Vertex 5
            halfLength, halfHeight, halfWidth,     // Vertex 6
            -halfLength, halfHeight, halfWidth     // Vertex 7
        ];
    
        // Define the normals for each vertex
        this.normals = [
            // One normal per vertex (8 vertices)
            0, 0, -1,  // Vertex 0
            0, 0, -1,  // Vertex 1
            0, 0, -1,  // Vertex 2
            0, 0, -1,  // Vertex 3
            0, 0, 1,   // Vertex 4
            0, 0, 1,   // Vertex 5
            0, 0, 1,   // Vertex 6
            0, 0, 1    // Vertex 7
        ];
    
        // Define texture coordinates (mapping the texture across the 6 faces)
        this.texCoords = [
            0, 0,  // Vertex 0
            1, 0,  // Vertex 1
            1, 1,  // Vertex 2
            0, 1,  // Vertex 3
            0, 0,  // Vertex 4
            1, 0,  // Vertex 5
            1, 1,  // Vertex 6
            0, 1   // Vertex 7
        ];
    
        // Define indices for the 6 faces (2 triangles per face)
        this.indices = [
            // Front face (z = -halfWidth)
            0, 3, 2,  0, 2, 1,  // OK
            // Back face (z = halfWidth)
            4, 5, 6, 4, 6, 7,  // OK
            // Top face (y = halfHeight)
            3, 7, 6,  3, 6, 2,  // OK
            // Bottom face (y = -halfHeight)
            0, 1, 5,  0, 5, 4,  // FIXED - was: 5, 1, 0,  5, 0, 4
            // Left face (x = -halfLength)
            0, 4, 7,  0, 7, 3,  // FIXED - was: 4, 7, 3,  4, 3, 0
            // Right face (x = halfLength)
            1, 2, 6,  1, 6, 5   // OK
        ];
    
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    display() {
        super.display();
    }
}