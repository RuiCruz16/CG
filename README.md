# 3D Scene Project - Computer Graphics (2024/2025)

## Overview
This project was developed as part of the **Computer Graphics** course during the **second semester of the third year** of the degree program. The goal was to apply the knowledge and techniques acquired throughout the course to create an interactive and visually appealing 3D scene. The project combines elements such as shaders, animations, and user interaction to simulate a dynamic and immersive environment.

## Features

### Sky-Sphere
- A sky-sphere simulates the horizon and sky, visible from the inside. It includes a panoramic texture to create the illusion of a realistic landscape. 
- The sphere is parameterized to invert its faces, ensuring visibility from within, and moves with the camera to maintain the illusion of infinite distance.

### Fire Station Building
- The fire station is composed of three connected modules, with a heliport on the roof. It features a customizable number of floors and windows, a "BOMBEIROS" sign above the main door, and a heliport with a circumscribed "H."

### Trees and Forest
- The forest is populated with procedurally generated trees of varying sizes, colors, and positions. Each tree consists of a cone-shaped trunk and a canopy made of pyramids. 
- Parameters such as trunk radius, tree height, canopy color, and inclination are randomized to create a natural look. The forest is generated as a grid with random offsets and variations.

### Helicopter
- The helicopter is fully animated and user-controllable. It includes a cabin, tail, rotors, landing gear, and a water bucket. Movements include forward, backward, turning, ascending, and descending. 
- The helicopter interacts with the environment, such as collecting water from a lake and extinguishing fires in the forest.

### Water and Fire
- The scene includes a lake with realistic textures and forest fires animated using shaders. The helicopter can collect water from the lake and drop it to extinguish the fires.

### Shaders and Animation
- The project uses shaders and animations to enhance realism. Fire flames oscillate randomly to simulate movement, and the heliport features animated textures and pulsating lights during helicopter maneuvers.
- Additionally, the heliport alternates between textures with the letter "H" and the words "DOWN" or "UP" during takeoff and landing, blending the textures smoothly using shaders.

## Practical Exercises
The repository also includes practical exercises completed during the course. These exercises were essential for building the foundational knowledge and skills applied in this project.

## Repository Structure
- **`project/`**: Contains the main project files, including the 3D scene implementation.
- **`tp1/` to `tp5/`**: Practical exercises from earlier assignments.

## Group T13G08
| Name             | Number    | E-Mail             |
| ---------------- | --------- | ------------------ |
| Miguel Guerrinha | 202205038 | up202205038@up.pt  |
| Rui Cruz         | 202208011 | up202208011@up.pt  |

----

  - [tp1](tp1/README.md)
  - [tp2](tp2/README.md)
  - [tp3](tp3/README.md)
  - [tp4](tp4/README.md)
  - [tp5](tp5/README.md)
  - [Project](project/README.md)
  