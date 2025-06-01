import { CGFobject } from "../lib/CGF.js";

/**
 * MySphere class
 * Creates a parametric sphere with configurable resolution
 */
export class MySphere extends CGFobject {
    constructor(scene, slices, stacks, invert = false) {
        super(scene);
        this.slices = slices; // Longitude divisions
        this.stacks = stacks; // Latitude divisions
        this.invert = invert; // Invert normal directions (for viewing inside)
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        let sliceAngle = 2 * Math.PI / this.slices; // Full circle divided by slices
        let stackAngle = Math.PI / this.stacks; // Half circle (pole to pole)

        // Vertices for each stack and slice
        for (let i = 0; i <= this.stacks; i++) {
            let stackHeight = Math.cos(i * stackAngle); // Height
            let radius = Math.sin(i * stackAngle); // XY-plane radius at this height

            for (let j = 0; j <= this.slices; j++) {
                let angle = j * sliceAngle;
                let x = radius * Math.cos(angle); // X coordinate 
                let y = radius * Math.sin(angle); // Y coordinate
                let z = stackHeight; // Z coordinate

                this.vertices.push(x, y, z);
                this.normals.push(x, y, z);

                // Texture coordinates
                let u = j / this.slices; // Horizontal
                let v = i / this.stacks; // Vertical
                this.texCoords.push(u, v);
            }
        }

        // Indices to create triangles
        for (let i = 0; i < this.stacks; i++) {
            for (let j = 0; j < this.slices; j++) {
                let first = (i * (this.slices + 1)) + j; // Top-left vertex
                let second = first + this.slices + 1; // Bottom-left vertex

                if (this.invert) {
                    // Inner-facing sphere
                    this.indices.push(first + 1, second, first);
                    this.indices.push(first + 1, second + 1, second);
                }
                else {
                    // Outer-facing sphere
                    this.indices.push(first, second, first + 1);
                    this.indices.push(second, second + 1, first + 1);
                }
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    
}