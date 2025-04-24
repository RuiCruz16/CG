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
        this.vertices.push(
            -halfLength, -halfHeight, -halfWidth,  // Vertex 0
            halfLength, -halfHeight, -halfWidth,   // Vertex 1
            halfLength, halfHeight, -halfWidth,    // Vertex 2
            -halfLength, halfHeight, -halfWidth,   // Vertex 3
            -halfLength, -halfHeight, halfWidth,   // Vertex 4
            halfLength, -halfHeight, halfWidth,    // Vertex 5
            halfLength, halfHeight, halfWidth,     // Vertex 6
            -halfLength, halfHeight, halfWidth     // Vertex 7
        );

        // Define the normals for each face of the rectangular prism
        // Normals pointing outwards (based on the faces)
        this.normals.push(
            0, 0, -1, // Front face
            0, 0, 1,  // Back face
            0, 1, 0,  // Top face
            0, -1, 0, // Bottom face
            -1, 0, 0, // Left face
            1, 0, 0   // Right face
        );

        // Define texture coordinates (mapping the texture across the 6 faces)
        this.texCoords.push(
            0, 0, 1, 0, 1, 1, 0, 1,  // Front face (0,1,2,3)
            0, 0, 1, 0, 1, 1, 0, 1,  // Back face (4,5,6,7)
            0, 0, 1, 0, 1, 1, 0, 1,  // Top face (3,2,6,7)
            0, 0, 1, 0, 1, 1, 0, 1,  // Bottom face (0,1,5,4)
            0, 0, 1, 0, 1, 1, 0, 1,  // Left face (0,3,7,4)
            0, 0, 1, 0, 1, 1, 0, 1   // Right face (1,2,6,5)
        );

        // Define indices for the 6 faces (2 triangles per face)
        this.indices.push(
            // Front face
            0, 1, 2,  0, 2, 3,
            // Back face
            4, 5, 6,  4, 6, 7,
            // Top face
            3, 2, 6,  3, 6, 7,
            // Bottom face
            0, 1, 5,  0, 5, 4,
            // Left face
            0, 3, 7,  0, 7, 4,
            // Right face
            1, 2, 6,  1, 6, 5
        );

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    display() {
        super.display();
    }
}