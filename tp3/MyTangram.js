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
        this.triangleBig = new MyTriangleBig(scene);
        this.initMaterials();
    }

    initMaterials() {

        // Green Diamond Material
        this.diamondMaterial = new CGFappearance(this.scene);
        this.diamondMaterial.setAmbient(1, 0, 0, 1.0);
        this.diamondMaterial.setDiffuse(0, 1, 0, 0);
        this.diamondMaterial.setSpecular(0.9, 0.9, 0.9, 1.0);
        this.diamondMaterial.setShininess(10.0);

        // Yellow Parallelogram Material
        this.parallelogramMaterial = new CGFappearance(this.scene);
        this.parallelogramMaterial.setAmbient(1, 0, 0, 1.0);
        this.parallelogramMaterial.setDiffuse(255/255, 234/255, 0, 0);
        this.parallelogramMaterial.setSpecular(0.9, 0.9, 0.9, 1.0);
        this.parallelogramMaterial.setShininess(10.0);

        // Red Small Triangle Material
        this.triangleSmallMaterial1 = new CGFappearance(this.scene);
        this.triangleSmallMaterial1.setAmbient(1, 0, 0, 1.0);
        this.triangleSmallMaterial1.setDiffuse(1, 0, 0, 0);
        this.triangleSmallMaterial1.setSpecular(0.9, 0.9, 0.9, 1.0);
        this.triangleSmallMaterial1.setShininess(10.0);

        // Red Small Triangle Material
        this.triangleSmallMaterial2 = new CGFappearance(this.scene);
        this.triangleSmallMaterial2.setAmbient(1, 0, 0, 1.0);
        this.triangleSmallMaterial2.setDiffuse(153/255, 50/255, 204/255, 0);
        this.triangleSmallMaterial2.setSpecular(0.9, 0.9, 0.9, 1.0);
        this.triangleSmallMaterial2.setShininess(10.0);

        // Orange Big Triangle Material
        this.triangleBigMaterial1 = new CGFappearance(this.scene);
        this.triangleBigMaterial1.setAmbient(1, 0, 0, 1.0);
        this.triangleBigMaterial1.setDiffuse(255/255, 165/255, 0, 0);
        this.triangleBigMaterial1.setSpecular(0.9, 0.9, 0.9, 1.0);
        this.triangleBigMaterial1.setShininess(10.0);

        // Blue Big Triangle Material
        this.triangleBigMaterial2 = new CGFappearance(this.scene);
        this.triangleBigMaterial2.setAmbient(1, 0, 0, 1.0);
        this.triangleBigMaterial2.setDiffuse(0, 150/255, 255/255, 0);
        this.triangleBigMaterial2.setSpecular(0.9, 0.9, 0.9, 1.0);
        this.triangleBigMaterial2.setShininess(10.0);

        // Pink Triangle Material
        this.triangleMaterial = new CGFappearance(this.scene);
        this.triangleMaterial.setAmbient(1, 0, 0, 1.0);
        this.triangleMaterial.setDiffuse(255/255, 182/255, 193/255, 0);
        this.triangleMaterial.setSpecular(0.9, 0.9, 0.9, 1.0);
        this.triangleMaterial.setShininess(10.0);
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
      
        this.scene.pushMatrix();
            this.scene.multMatrix(matrixTranslate);
            this.scene.multMatrix(matrixRotate);
            this.scene.customMaterial.apply();
            //this.diamondMaterial.apply();
            this.diamond.display();
        this.scene.popMatrix();
      
        this.scene.pushMatrix();
            this.scene.translate(0, Math.sqrt(8)/2, 0);
            this.scene.rotate(-3 * Math.PI/4, 0, 0, 1);
            this.triangleBigMaterial2.apply();
            this.triangleBig.display();
        this.scene.popMatrix();
      
        this.scene.pushMatrix();
            this.scene.translate(0, Math.sqrt(8)/2, 0);
            this.scene.rotate(Math.PI/4, 0, 0, 1);
            this.triangleBigMaterial1.apply();
            this.triangleBig.display();
        this.scene.popMatrix();
      
        this.scene.pushMatrix();
            this.scene.translate(0, Math.sqrt(8), 0);
            this.scene.rotate(-3 * Math.PI/4, 0, 0, 1);
            this.triangleMaterial.apply();
            this.triangle.display();
        this.scene.popMatrix();
      
        this.scene.pushMatrix();
            this.scene.translate(Math.sqrt(2)/2, 0, 0);
            this.scene.rotate(-Math.PI/4, 0, 0, 1);
            this.scene.rotate(Math.PI, 1, 0, 0);
            this.parallelogramMaterial.apply();
            this.parallelogram.display();
        this.scene.popMatrix();
      
        this.scene.pushMatrix();
            this.scene.translate(0, -3*Math.sqrt(2)/2, 0);
            this.scene.translate(-Math.sqrt(2), 0, 0);
            this.scene.rotate(Math.PI/4, 0, 0, 1);
            this.triangleSmallMaterial2.apply();
            this.triangleSmall.display();
        this.scene.popMatrix();
      
        this.scene.pushMatrix();
            this.scene.translate(0, -Math.sqrt(2)/2, 0);
            this.scene.translate(-Math.sqrt(2), 0, 0);
            this.scene.rotate(-3*Math.PI/4, 0, 0, 1);
            this.triangleSmallMaterial1.apply();
            this.triangleSmall.display();
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