import {CGFobject} from '../lib/CGF.js';
/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 * @param slices - Number of divisions around the Y axis
 * @param stacks - Number of divisions along the height
 * @param height - Height of the cylinder
 * @param radius - Radius of the cylinder
 */
export class MyCylinderWTopCap extends CGFobject {
    constructor(scene, slices, stacks, height, radius) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.height = height || 1; // Default height of 1
        this.radius = radius || 1; // Default radius of 1
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        let angle = 2 * Math.PI / this.slices;
        let vertexCount = 0;

        // Generate the cylinder sides
        for (let j = 0; j <= this.stacks; j++) {
            let z = (j / this.stacks) * this.height;
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
                let current = i + j * (this.slices + 1);
                let next = current + 1; // Because we added one extra vertex per row
                let above = current + (this.slices + 1);
                let aboveNext = above + 1;
        
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

        // Generate the bottom cap indices
        for (let i = 0; i < this.slices; i++) {
            this.indices.push(
                bottomCenterIndex,
                bottomCenterIndex + i + 2,
                bottomCenterIndex + i + 1
            );
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
