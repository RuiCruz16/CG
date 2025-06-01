import {CGFobject} from '../lib/CGF.js';

/**
 * MyCylinderWTopCap
 * Creates a parametric cylinder with only the bottom cap (no top cap)
 * Same as MyCylinder but without the top cap, used in the helicopter's water bucket
 */
export class MyCylinderWTopCap extends CGFobject {
    constructor(scene, slices, stacks, height, radius) {
        super(scene);
        this.slices = slices; // Angular divisions (around the cylinder)
        this.stacks = stacks; // Vertical divisions (along the height)
        this.height = height || 1; // Default height of 1
        this.radius = radius || 1; // Default radius of 1
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        let angle = 2 * Math.PI / this.slices; // Angular step between slices
        let vertexCount = 0;

        // Generate the cylinder sides
        for (let j = 0; j <= this.stacks; j++) {
            let z = (j / this.stacks) * this.height;
            // Create vertices around the circumference at current height
            for (let i = 0; i <= this.slices; i++) {
                let x = this.radius * Math.cos(i * angle);
                let y = this.radius * Math.sin(i * angle);
                let sizeNormal = Math.sqrt(x * x + y * y);

                this.vertices.push(x, y, z);
                this.normals.push(x/sizeNormal, y/sizeNormal, 0);
                this.texCoords.push(i/this.slices, j/this.stacks);
                vertexCount++;
            }
        }

        // Generate indices for the cylinder sides
        for (let j = 0; j < this.stacks; j++) {
            for (let i = 0; i < this.slices; i++) {
                let current = i + j * (this.slices + 1); // Current vertex
                let next = current + 1; // Next vertex in same stack
                let above = current + (this.slices + 1); // Vertex above current
                let aboveNext = above + 1; // Vertex above and next
        
                this.indices.push(current, next, above);
                this.indices.push(next, aboveNext, above);
            }
        }      

        // Generate the bottom cap (at z = 0)
        let bottomCenterIndex = vertexCount;
        this.vertices.push(0, 0, 0); // Center of the bottom cap
        this.normals.push(0, 0, -1); // Normal pointing down
        this.texCoords.push(0.5, 0.5); // Center of the texture
        vertexCount++;

        // Generate the bottom cap vertices
        for (let i = 0; i <= this.slices; i++) {
            let x = this.radius * Math.cos(i * angle);
            let y = this.radius * Math.sin(i * angle);

            this.vertices.push(x, y, 0);
            this.normals.push(0, 0, -1);
            this.texCoords.push(0.5 + 0.5 * Math.cos(i * angle), 0.5 + 0.5 * Math.sin(i * angle));
            vertexCount++;
        }

        // Generate the bottom cap indices (triangles from center to perimeter)
        for (let i = 0; i < this.slices; i++) {
            this.indices.push(
                bottomCenterIndex, // Center point
                bottomCenterIndex + i + 2, // Next perimeter point
                bottomCenterIndex + i + 1 // Current perimeter point
            );
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
