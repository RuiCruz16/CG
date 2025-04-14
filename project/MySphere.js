import { CGFobject } from "../lib/CGF.js";

/**
 * MySphere
 * @constructor
 * @param scene - Reference to MyScene object
 */

export class MySphere extends CGFobject {
    constructor(scene, slices, stacks, invert = false) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.invert = invert;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        let sliceAngle = 2 * Math.PI / this.slices;
        let stackAngle = Math.PI / this.stacks;

        for (let i = 0; i <= this.stacks; i++) {
            let stackHeight = Math.cos(i * stackAngle);
            let radius = Math.sin(i * stackAngle);

            for (let j = 0; j <= this.slices; j++) {
                let angle = j * sliceAngle;
                let x = radius * Math.cos(angle);
                let y = radius * Math.sin(angle);
                let z = stackHeight;

                this.vertices.push(x, y, z);
                this.normals.push(x, y, z);

                let u = j / this.slices;
                let v = i / this.stacks;
                this.texCoords.push(u, v);
            }
        }

        for (let i = 0; i < this.stacks; i++) {
            for (let j = 0; j < this.slices; j++) {
                let first = (i * (this.slices + 1)) + j;
                let second = first + this.slices + 1;

                if (this.invert) {
                    this.indices.push(first + 1, second, first);
                    this.indices.push(first + 1, second + 1, second);
                }
                else {
                    this.indices.push(first, second, first + 1);
                    this.indices.push(second, second + 1, first + 1);
                }
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    
}