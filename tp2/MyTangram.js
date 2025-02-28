import {CGFobject} from '../lib/CGF.js';
import { MyDiamond } from "./MyDiamond.js";
import { MyTriangle } from "./MyTriangle.js";
import { MyParallelogram } from "./MyParallelogram.js";
import { MyTriangleSmall } from "./MyTriangleSmall.js";
import { MyTriangleBig } from "./MyTriangleBig.js";
/**
 * MyTangram
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTangram extends CGFobject {
    constructor(scene) {
      super(scene);
      this.diamond = new MyDiamond(scene);
      this.triangle = new MyTriangle(scene);
      this.parallelogram = new MyParallelogram(scene);
      this.triangleSmall = new MyTriangleSmall(scene);
      this.triangleBig = new MyTriangleBig(scene);
    }
    
    display() {
      var matrixTranslate = [
        1,0,0,0,
        0,1,0,0,
        0,0,1,0,
        0,-Math.sqrt(2)/2,0,1,
      ]
  
      var matrixRotate = [
        Math.cos(Math.PI/4), Math.sin(Math.PI/4), 0, 0,
        -Math.sin(Math.PI/4), Math.cos(Math.PI/4), 0, 0,
        0,0,1,0,
        0,0,0,1,
      ]

      this.scene.pushMatrix();
      this.scene.multMatrix(matrixTranslate);
      this.scene.multMatrix(matrixRotate);
      this.diamond.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();
      this.scene.translate(0, Math.sqrt(8)/2, 0);
      this.scene.rotate(-3 * Math.PI/4, 0,0,1);
      this.triangleBig.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();
      this.scene.translate(0, Math.sqrt(8)/2, 0);
      this.scene.rotate(Math.PI/4, 0,0,1);
      this.triangleBig.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();
      this.scene.translate(0, Math.sqrt(8), 0);
      this.scene.rotate(5*Math.PI/4,0,0,1);
      this.triangle.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();
      this.scene.translate(-Math.sqrt(2)/2 * 2, -Math.sqrt(2)/2, 0);
      this.scene.rotate(-3*Math.PI/4,0,0,1);
      this.triangleSmall.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();
      this.scene.translate(-Math.sqrt(2)/2 * 2, -Math.sqrt(2)/2 * 3, 0);
      this.scene.rotate(Math.PI/4,0,0,1);
      this.triangleSmall.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();
      this.scene.translate(Math.sqrt(2)/2,0,0);
      this.scene.rotate(- Math.PI/4,0,0,1);
      this.scene.rotate(Math.PI, 1, 0, 0);  // Rotation on the X axis to flip the parallelogram
      this.parallelogram.display();
      this.scene.popMatrix();
    }
}
