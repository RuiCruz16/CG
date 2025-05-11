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
    
        this.normals = [
            0, 1, -1,  // Vertex 0
            0, 1, -1,  // Vertex 1
            0, 1, -1,  // Vertex 2
            0, 1, -1,  // Vertex 3
            0, 1, 1,   // Vertex 4
            0, 1, 1,   // Vertex 5
            0, 1, 1,   // Vertex 6
            0, 1, 1,    // Vertex 7
        ];
    
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
    
        this.indices = [
            // Front face (z = -halfWidth)
            0, 3, 2,  0, 2, 1,
            // Back face (z = halfWidth)
            4, 5, 6, 4, 6, 7,
            // Top face (y = halfHeight)
            3, 7, 6,  3, 6, 2,
            // Bottom face (y = -halfHeight)
            0, 1, 5,  0, 5, 4,
            // Left face (x = -halfLength)
            0, 4, 7,  0, 7, 3,
            // Right face (x = halfLength)
            1, 2, 6,  1, 6, 5
        ];
    
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    enableNormalViz() {
        super.enableNormalViz();
    }
      
    disableNormalViz() {
        super.disableNormalViz();
    }  

    display() {
        super.display();
    }
}
