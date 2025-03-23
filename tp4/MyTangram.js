import { CGFappearance, CGFobject } from "../lib/CGF.js";
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
        this.triangleSmallPurple = new MyTriangleSmall(scene, [0, 0, 0, 0.5, 0.25, 0.25, 0, 0, 0, 0.5, 0.25, 0.25]);
        this.triangleSmallRed = new MyTriangleSmall(scene, [0.25, 0.75, 0.75, 0.75, 0.5, 0.5, 0.25, 0.75, 0.75, 0.75, 0.5, 0.5]);

        this.triangleBigBlue = new MyTriangleBig(scene, [1, 0, 0, 0, 0.5, 0.5, 1, 0, 0, 0, 0.5, 0.5]);
        this.triangleBigOrange = new MyTriangleBig(scene, [1, 1, 1, 0, 0.5, 0.5, 1, 1, 1, 0, 0.5, 0.5]);
        this.initMaterials();
    }
    initMaterials() {

        // Tangram texture
        this.texture = new CGFappearance(this.scene);
        this.texture.setAmbient(0.1, 0.1, 0.1, 1);
        this.texture.setDiffuse(0.9, 0.9, 0.9, 1);
        this.texture.setSpecular(0.1, 0.1, 0.1, 1);
        this.texture.setShininess(10.0);
        this.texture.loadTexture('images/tangram.png');

    }
    display() {
        var matrixTranslate = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, -Math.sqrt(2)/2, 0, 1
        ];
      
        var matrixRotate = [
            Math.cos(Math.PI/4), Math.sin(Math.PI/4), 0, 0,
            -Math.sin(Math.PI/4), Math.cos(Math.PI/4), 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
      
        //this.scene.multMatrix(sca);
      
        // Diamond
        this.scene.pushMatrix();
            this.scene.multMatrix(matrixTranslate);
            this.scene.multMatrix(matrixRotate);
            this.texture.apply();
            this.diamond.display();
        this.scene.popMatrix();

        // Triangle BiBlue
        this.scene.pushMatrix();
            this.scene.translate(0, Math.sqrt(8)/2, 0);
            this.scene.rotate(-3 * Math.PI/4, 0, 0, 1);
            //this.triangleBigMaterial2.apply();
            this.texture.apply();
            this.triangleBigBlue.display();
        this.scene.popMatrix();
      
        // Triangle BigOrange
        this.scene.pushMatrix();
            this.scene.translate(0, Math.sqrt(8)/2, 0);
            this.scene.rotate(Math.PI/4, 0, 0, 1);
            //this.triangleBigMaterial1.apply();
            this.texture.apply();
            this.triangleBigOrange.display();
        this.scene.popMatrix();
      
        // Triangle
        this.scene.pushMatrix();
            this.scene.translate(0, Math.sqrt(8), 0);
            this.scene.rotate(-3 * Math.PI/4, 0, 0, 1);
            //this.triangleMaterial.apply();
            this.texture.apply();
            this.triangle.display();
        this.scene.popMatrix();
      
        // Parallelogram
        this.scene.pushMatrix();
            this.scene.translate(Math.sqrt(2)/2, 0, 0);
            this.scene.rotate(-Math.PI/4, 0, 0, 1);
            this.scene.rotate(Math.PI, 1, 0, 0);
            //this.parallelogramMaterial.apply();
            this.texture.apply();
            this.parallelogram.display();
        this.scene.popMatrix();
      
        // Triangle Small Purple
        this.scene.pushMatrix();
            this.scene.translate(0, -3*Math.sqrt(2)/2, 0);
            this.scene.translate(-Math.sqrt(2), 0, 0);
            this.scene.rotate(Math.PI/4, 0, 0, 1);
            //this.triangleSmallMaterial2.apply();
            this.texture.apply();
            this.triangleSmallPurple.display();
        this.scene.popMatrix();
        
        // Triangle Small Red
        this.scene.pushMatrix();
            this.scene.translate(0, -Math.sqrt(2)/2, 0);
            this.scene.translate(-Math.sqrt(2), 0, 0);
            this.scene.rotate(-3*Math.PI/4, 0, 0, 1);
            //this.triangleSmallMaterial1.apply();
            this.texture.apply();
            this.triangleSmallRed.display();
        this.scene.popMatrix();
    }
    enableNormalViz(){
        this.diamond.enableNormalViz()
        this.triangle.enableNormalViz()
        this.triangleBig.enableNormalViz()
        this.triangleSmall.enableNormalViz()
        this.parallelogram.enableNormalViz()
    };
    disableNormalViz(){
        this.diamond.disableNormalViz()
        this.triangle.disableNormalViz()
        this.triangleBig.disableNormalViz()
        this.triangleSmall.disableNormalViz()
        this.parallelogram.disableNormalViz()
    };
}