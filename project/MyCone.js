import { CGFobject } from '../lib/CGF.js';

/**
 * MyCone
 * @constructor
 * @param scene - Reference to MyScene object
 * @param slices - Number of divisions around the Y axis (circular divisions)
 * @param stacks - Number of divisions along the Y axis (vertical divisions)
 * @param height - Height of the cone
 * @param radius - Radius of the base of the cone
 */
export class MyCone extends CGFobject {
    constructor(scene, slices, stacks, height, radius) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.height = height;
        this.radius = radius;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
    
        var ang = 0;
        var alphaAng = 2 * Math.PI / this.slices;
        var stackHeight = this.height / this.stacks;
        var stackRadius = this.radius;
    
        // Create vertices, normals, and texture coordinates
        for (var i = 0; i <= this.stacks; i++) {
            var currentHeight = i * stackHeight;
            var currentRadius = stackRadius * (1 - (i / this.stacks));
    
            for (var j = 0; j < this.slices; j++) {
                var x = currentRadius * Math.cos(ang);
                var z = currentRadius * Math.sin(ang);
                var y = currentHeight;
    
                this.vertices.push(x, y, z);
                this.normals.push(x, 0.707, z);
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
                var current = i * this.slices + j;
                var next = (j + 1) % this.slices + i * this.slices;

                this.indices.push(current, current + this.slices, next);
                this.indices.push(next, current + this.slices, next + this.slices);
            }
        }
    
        // Add the base of the cone
        var baseCenterIndex = this.vertices.length / 3;
        this.vertices.push(0, 0, 0);
        this.normals.push(0, -1, 0);
    
        ang = 0;
        for (var j = 0; j < this.slices; j++) {
            var x = this.radius * Math.cos(ang);
            var z = this.radius * Math.sin(ang);
    
            this.vertices.push(x, 0, z);
            this.normals.push(0, -1, 0);
    
            var next = (j + 1) % this.slices;
            this.indices.push(baseCenterIndex, baseCenterIndex + 1 + j, baseCenterIndex + 1 + next);
    
            ang += alphaAng;
        }

        ang = 0;
        for (var j = 0; j <= this.slices; j++) {
            this.texCoords.push(0.5 + 0.5 * Math.cos(ang), 0.5 + 0.5 * Math.sin(ang));
            ang += alphaAng;
        }
    
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
