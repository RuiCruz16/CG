import {CGFobject} from '../lib/CGF.js';
/**
 * MyPrism
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyPrism extends CGFobject {
    constructor(scene, slices, stacks) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();
    }
    
    initBuffers() {
        
        this.vertices = [];
        this.indices = [];
        this.normals = [];

        let currentIndex = 0;
        let angle = 2 * Math.PI / this.slices;

        for (let i = 0; i < this.slices; i++) {
          let x1 = Math.cos(i * angle);
          let x2 = Math.cos((i + 1) * angle);
          let y1 = Math.sin(i * angle);
          let y2 = Math.sin((i + 1) * angle);

          let lenStack = 1 / this.stacks;

          for (let j = 0; j < this.stacks; j++) {
            let xNormal = Math.cos((i + 0.5) * angle);
            let yNormal = Math.sin((i + 0.5) * angle);
            let sizeNormal = Math.sqrt(xNormal * xNormal + yNormal * yNormal);

            this.vertices.push(x1, y1, lenStack * j, x2, y2, lenStack * j, x1, y1, lenStack * j + lenStack, x2, y2, lenStack * j + lenStack);
            this.indices.push(currentIndex, currentIndex + 1, currentIndex + 3, currentIndex, currentIndex + 3, currentIndex + 2);
            this.normals.push( xNormal/sizeNormal, yNormal/sizeNormal, 0, xNormal/sizeNormal, yNormal/sizeNormal, 0, xNormal/sizeNormal, yNormal/sizeNormal, 0, xNormal/sizeNormal, yNormal/sizeNormal, 0);

            currentIndex+=4;
          }
        }

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}
