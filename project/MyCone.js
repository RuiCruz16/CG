import { CGFobject } from '../lib/CGF.js';

/**
 * MyCone
 * Creates a parametric cone with configurable dimensions and resolution
 * Used in the project for tree trunks
 */
export class MyCone extends CGFobject {
    constructor(scene, slices, stacks, height, radius) {
        super(scene);
        this.slices = slices; // Angular divisions (around Y axis)
        this.stacks = stacks; // Vertical divisions (along Y axis)
        this.height = height;
        this.radius = radius; // Radius of the base of the cone
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
    
        var ang = 0;
        var alphaAng = 2 * Math.PI / this.slices; // Angular step between slices
        var stackHeight = this.height / this.stacks; // Height of each stack
        var stackRadius = this.radius;
    
        // Create vertices, normals, and texture coordinates for the cone's lateral surface
        // Builds the cone from bottom to top, stack by stack
        for (var i = 0; i <= this.stacks; i++) {
            var currentHeight = i * stackHeight;
            var currentRadius = stackRadius * (1 - (i / this.stacks)); // From base (full radius) to top (zero)
    
            // Create vertices around the current circular cross-section
            for (var j = 0; j < this.slices; j++) {
                var x = currentRadius * Math.cos(ang);
                var z = currentRadius * Math.sin(ang);
                var y = currentHeight;
    
                this.vertices.push(x, y, z);
                this.normals.push(x, 0.7, z);
                this.texCoords.push(j / this.slices, i / this.stacks);
                ang += alphaAng;
            }
        }
    
        // Add the cone's apex
        this.vertices.push(0, this.height, 0);
        this.normals.push(0, 1, 0);
        this.texCoords.push(0.5, 1);
    
        // Create the cone's faces
        for (var i = 0; i < this.stacks; i++) {
            for (var j = 0; j < this.slices; j++) {
                var current = i * this.slices + j; // Current vertex index
                var next = (j + 1) % this.slices + i * this.slices; // Next vertex in same stack

                this.indices.push(current, current + this.slices, next);
                this.indices.push(next, current + this.slices, next + this.slices);
            }
        }
    
        // Add the base of the cone
        var baseCenterIndex = this.vertices.length / 3;
        this.vertices.push(0, 0, 0);
        this.normals.push(0, -1, 0);
    
        // Create vertices around the circumference of the base
        ang = 0;
        for (var j = 0; j < this.slices; j++) {
            var x = this.radius * Math.cos(ang);
            var z = this.radius * Math.sin(ang);
    
            this.vertices.push(x, 0, z);
            this.normals.push(0, -1, 0);
    
            // Create triangular face from center to perimeter
            var next = (j + 1) % this.slices;
            this.indices.push(
                baseCenterIndex,                   // Center of base
                baseCenterIndex + 1 + j,           // Current perimeter point
                baseCenterIndex + 1 + next         // Next perimeter point
            );
    
            ang += alphaAng;
        }

        // Add texture coordinates for the base
        ang = 0;
        for (var j = 0; j <= this.slices; j++) {
            this.texCoords.push(0.5 + 0.5 * Math.cos(ang), 0.5 + 0.5 * Math.sin(ang));
            ang += alphaAng;
        }
    
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
