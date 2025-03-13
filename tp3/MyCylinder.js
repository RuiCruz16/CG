import {CGFobject} from '../lib/CGF.js';
/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyCylinder extends CGFobject {
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

        let angle = 2 * Math.PI / this.slices;

        for (let j = 0; j <= this.stacks; j++) {
          let z = j / this.stacks;
          for (let i = 0; i < this.slices; i++) {
              let x = Math.cos(i * angle);
              let y = Math.sin(i * angle);
              
              this.vertices.push(x, y, z);
              
              this.normals.push(x, y, 0);
          }
        }

        for (let j = 0; j < this.stacks; j++) {
          for (let i = 0; i < this.slices; i++) {
              let next = (i + 1) % this.slices;
              let current = i + j * this.slices;
              let above = current + this.slices;
              let aboveNext = next + j * this.slices + this.slices;
      
              this.indices.push(current, next, above);
      
              this.indices.push(next, aboveNext, above);
          }
        }      

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}
