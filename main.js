import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { threeJsTechniques } from './config.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc);

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 1;
controls.maxDistance = 500;
controls.maxPolarAngle = Math.PI / 2;

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Ground Plane
const planeGeometry = new THREE.PlaneGeometry(100, 100);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x999999, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -0.5; // Adjust based on your scene needs
scene.add(plane);


// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// LLM Interaction
const promptInput = document.getElementById('promptInput');
const generateButton = document.getElementById('generateButton');

generateButton.addEventListener('click', async () => {
    const userPrompt = promptInput.value.trim();
    if (!userPrompt) return;

    // Disable button during generation
    generateButton.disabled = true;
    generateButton.textContent = 'Generating...';

    try {
        const completion = await websim.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are a 3D object generation assistant. Based on the user's prompt, generate a description of a 3D object using Three.js techniques.
                    Use the provided list of advanced techniques to inform your response.
                    Respond ONLY with a JSON object following this exact structure, and no other text:
                    \`\`\`json
                    {
                      "description": "A brief text description of the generated object.",
                      "geometry": {
                        "type": "BoxGeometry | SphereGeometry | CylinderGeometry | ConeGeometry | TorusGeometry | PlaneGeometry | BufferGeometry | LatheGeometry | ExtrudeGeometry | ShapeGeometry | TubeGeometry | TextGeometry", // Choose the most appropriate base geometry
                        "parameters": {} // Parameters specific to the chosen geometry type (e.g., { "width": 1, "height": 1, "depth": 1 } for BoxGeometry)
                      },
                      "material": {
                        "type": "MeshStandardMaterial | MeshBasicMaterial | MeshLambertMaterial | MeshPhongMaterial | MeshPhysicalMaterial", // Choose a material type
                        "parameters": { // Parameters for the material (e.g., { "color": "#ff0000", "roughness": 0.5, "metalness": 0.5 })
                            "color": "#ffffff" // Default color
                        }
                      },
                      "position": { "x": 0, "y": 0, "z": 0 }, // Initial position
                      "rotation": { "x": 0, "y": 0, "z": 0 }, // Initial rotation in radians
                      "scale": { "x": 1, "y": 1, "z": 1 }, // Initial scale
                      "advanced_techniques_used": ["Description of any advanced techniques applied, e.g., 'CSG subtraction', 'Displacement Mapping', 'PBR Texturing']" // Optional array describing techniques used
                    }
                    \`\`\`

                    Available advanced techniques reference:
                    ${JSON.stringify(threeJsTechniques, null, 2)}
                    `,
                },
                {
                    role: "user",
                    content: userPrompt,
                },
            ],
            json: true, // Ensure the response is JSON
        });

        const objectData = JSON.parse(completion.content);
        console.log("LLM Response:", objectData);
        createObjectFromData(objectData);

    } catch (error) {
        console.error('Error generating object:', error);
        alert('Failed to generate object. Please check the console for details.');
    } finally {
        // Re-enable button
        generateButton.disabled = false;
        generateButton.textContent = 'Generate';
        promptInput.value = ''; // Clear input
    }
});


function createObjectFromData(data) {
    try {
        // Geometry
        const GeometryClass = THREE[data.geometry.type];
        if (!GeometryClass) throw new Error(`Invalid geometry type: ${data.geometry.type}`);
        const geometryArgs = Object.values(data.geometry.parameters || {});
         // Handle potential issues with parameter order/types if necessary
         // For BufferGeometry, data might need specific handling (vertices, faces etc.)
         let geometry;
         if (data.geometry.type === 'BufferGeometry') {
             // TODO: Implement specific BufferGeometry creation logic if needed based on LLM output structure
             console.warn("BufferGeometry creation from LLM data is not fully implemented.");
             geometry = new THREE.BoxGeometry(1,1,1); // Fallback for now
         } else if (data.geometry.type === 'TextGeometry') {
            // TextGeometry requires FontLoader, handle asynchronously or provide default font
             console.warn("TextGeometry requires a Font. Using fallback BoxGeometry.");
             geometry = new THREE.BoxGeometry(1,1,1); // Fallback
         }
          else {
             geometry = new GeometryClass(...geometryArgs);
         }


        // Material
        const MaterialClass = THREE[data.material.type];
        if (!MaterialClass) throw new Error(`Invalid material type: ${data.material.type}`);
        const materialParams = { ...data.material.parameters };
        if (materialParams.color) {
            materialParams.color = new THREE.Color(materialParams.color);
        }
        // TODO: Handle textures if the LLM provides texture URLs/data
        const material = new MaterialClass(materialParams);

        // Mesh
        const mesh = new THREE.Mesh(geometry, material);

        // Transformations
        mesh.position.set(data.position.x, data.position.y, data.position.z);
        mesh.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
        mesh.scale.set(data.scale.x, data.scale.y, data.scale.z);

        // Add to scene
        scene.add(mesh);
        console.log(`Added object: ${data.description || 'Generated Object'}`);

    } catch (error) {
        console.error("Error creating object from data:", error, data);
        alert(`Failed to create object: ${error.message}`);
    }
}

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { threeJsTechniques } from './config.js';
// Import specific geometries if needed for advanced cases, e.g.:
// import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
// import { FontLoader } from 'three/addons/loaders/FontLoader.js';

// --- Core Scene Setup ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // Sky blue background

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(3, 3, 7); // Adjusted initial camera position

const renderer = new THREE.WebGLRenderer({ antialias: true }); // Enable antialiasing
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadows
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadows
document.body.appendChild(renderer.domElement);

// --- Controls ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.screenSpacePanning = false;
controls.minDistance = 1;
controls.maxDistance = 100;
// controls.maxPolarAngle = Math.PI / 2; // Allow looking slightly under

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Slightly brighter ambient
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // Stronger directional light
directionalLight.position.set(8, 15, 10);
directionalLight.castShadow = true; // Enable shadow casting
// Configure shadow properties for better quality
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;
directionalLight.shadow.camera.left = -20;
directionalLight.shadow.camera.right = 20;
directionalLight.shadow.camera.top = 20;
directionalLight.shadow.camera.bottom = -20;

scene.add(directionalLight);
// const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 5); // Optional: Visualize light
// scene.add(lightHelper);
// const shadowHelper = new THREE.CameraHelper( directionalLight.shadow.camera ); // Optional: Visualize shadow frustum
// scene.add( shadowHelper );


// --- Ground Plane ---
const planeGeometry = new THREE.PlaneGeometry(50, 50);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa, // Slightly lighter grey
    roughness: 0.8,
    metalness: 0.2 // Slightly metallic ground
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -0.5;
plane.receiveShadow = true; // Allow ground to receive shadows
scene.add(plane);

// --- Animation Loop ---
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// --- Window Resize Handler ---
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// --- LLM Interaction & Object Creation ---
const promptInput = document.getElementById('promptInput');
const generateButton = document.getElementById('generateButton');
const loadingIndicator = document.getElementById('loadingIndicator');
const objectContainer = new THREE.Group(); // Group to hold generated objects
scene.add(objectContainer);

// Add keypress listener to input field
promptInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default form submission if it were in a form
        generateButton.click(); // Trigger button click
    }
});


generateButton.addEventListener('click', async () => {
    const userPrompt = promptInput.value.trim();
    if (!userPrompt) {
        alert("Please enter a description for the object.");
        return;
    }

    generateButton.disabled = true;
    loadingIndicator.style.display = 'inline';
    promptInput.disabled = true; // Disable input while loading

    // --- LLM Request Structure ---
    // This structure is crucial for the LLM to understand how to respond.
    const systemPrompt = `
You are a 3D object generation assistant for Three.js. Your task is to interpret the user's request and translate it into parameters for creating a 3D mesh.
Use the provided list of advanced Three.js techniques to inform your geometry and material choices where appropriate.

**Response Requirements:**
Respond ONLY with a single JSON object adhering strictly to the following schema. Do not include any introductory text, explanations, apologies, or markdown formatting.

\`\`\`json
{
  "description": "A brief text description of the generated object based on the prompt.",
  "geometry": {
    "type": "BoxGeometry | SphereGeometry | CylinderGeometry | ConeGeometry | TorusGeometry | PlaneGeometry | BufferGeometry | LatheGeometry | ExtrudeGeometry | ShapeGeometry | TubeGeometry | DodecahedronGeometry | IcosahedronGeometry | OctahedronGeometry | TetrahedronGeometry | TorusKnotGeometry",
    "parameters": {
      // Parameters specific to the chosen geometry type. Examples:
      // BoxGeometry: { "width": number, "height": number, "depth": number, "widthSegments?": integer, "heightSegments?": integer, "depthSegments?": integer }
      // SphereGeometry: { "radius": number, "widthSegments?": integer, "heightSegments?": integer, "phiStart?": number, "phiLength?": number, "thetaStart?": number, "thetaLength?": number }
      // CylinderGeometry: { "radiusTop": number, "radiusBottom": number, "height": number, "radialSegments?": integer, "heightSegments?": integer, "openEnded?": boolean, "thetaStart?": number, "thetaLength?": number }
      // ConeGeometry: { "radius": number, "height": number, "radialSegments?": integer, "heightSegments?": integer, "openEnded?": boolean, "thetaStart?": number, "thetaLength?": number }
      // TorusGeometry: { "radius": number, "tube": number, "radialSegments?": integer, "tubularSegments?": integer, "arc?": number }
      // LatheGeometry: { "points": [{"x": number, "y": number}], "segments?": integer, "phiStart?": number, "phiLength?": number } // points MUST be Vector2 format {x,y}
      // ExtrudeGeometry: { "shapes": [{ "path": [{"x": number, "y": number}], "holes?": [[{"x": number, "y": number}]] }], "options": { "steps?": integer, "depth": number, "bevelEnabled?": boolean, "bevelThickness?": number, "bevelSize?": number, "bevelOffset?": number, "bevelSegments?": integer, "extrudePath?": "TODO", "UVGenerator?": "TODO" } } // Provide simple shapes for now
      // BufferGeometry: { "attributes": { "position": [number, number, number, ...], "normal?": [number, number, number, ...], "uv?": [number, number, ...] }, "index?": [integer, integer, integer, ...] } // Use only if absolutely necessary and provide simple data
      // Other Geometries: Check Three.js docs for parameters (e.g., TorusKnot: { radius, tube, tubularSegments, radialSegments, p, q })
    }
  },
  "material": {
    "type": "MeshStandardMaterial | MeshBasicMaterial | MeshLambertMaterial | MeshPhongMaterial | MeshPhysicalMaterial | MeshNormalMaterial | MeshDepthMaterial",
    "parameters": {
      "color": "hex_color_string", // e.g., "#ff0000"
      "wireframe?": boolean,
      "transparent?": boolean,
      "opacity?": number, // (0.0 to 1.0) only if transparent is true
      // Standard/Physical specific:
      "roughness?": number, // (0.0 to 1.0)
      "metalness?": number, // (0.0 to 1.0)
      // Physical specific:
      "clearcoat?": number, // (0.0 to 1.0)
      "clearcoatRoughness?": number, // (0.0 to 1.0)
      "transmission?": number, // (0.0 to 1.0) for glass-like materials
      "ior?": number, // (Index of Refraction, ~1.0 to 2.3) relevant for transmission
      "thickness?": number, // Relevant for transmission
      // Phong specific:
      "specular?": "hex_color_string",
      "shininess?": number
      // TODO: Add map parameters later (map, normalMap, roughnessMap, metalnessMap, displacementMap etc.) - keep simple for now.
    }
  },
  "position": { "x": 0, "y": 0, "z": 0 },
  "rotation": { "x": 0, "y": 0, "z": 0 }, // Radians
  "scale": { "x": 1, "y": 1, "z": 1 },
  "cast_shadow": true, // Default to casting shadows
  "receive_shadow": false, // Default to not receiving shadows (usually handled by ground)
  "advanced_techniques_used": ["Optional: list technique names used from the provided context if applicable, e.g., 'LatheGeometry for vase shape', 'PBR material for metalness'"]
}
\`\`\`

**Available Advanced Techniques Reference:**
${JSON.stringify(threeJsTechniques, null, 2)}

**Instructions:**
1.  Analyze the user prompt: "${userPrompt}".
2.  Choose the most appropriate geometry type and parameters. Use simpler geometries (Box, Sphere, Cylinder) unless the prompt strongly suggests a more complex one (like 'vase' -> Lathe, 'gear' -> Extrude). If using Lathe/Extrude, provide simple point data. Avoid BufferGeometry unless absolutely necessary for very specific custom shapes described.
3.  Choose the most appropriate material type and parameters based on the description (e.g., 'shiny red plastic' -> MeshPhongMaterial or MeshStandardMaterial with low roughness, 'dull metal' -> MeshStandardMaterial with high roughness, high metalness). Default to MeshStandardMaterial if unsure. Set color based on the prompt.
4.  Set initial position, rotation, and scale. Position Y should generally be >= 0 to be above the ground plane.
5.  Decide if the object should cast shadows (usually true).
6.  Generate the JSON output strictly following the schema.
`;


    try {
        console.log("Sending request to LLM...");
        const completion = await websim.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                // No user message needed here as it's embedded in the system prompt
            ],
            json: true,
        });

        console.log("LLM Raw Response:", completion.content); // Log the raw string
        // Clear previous objects before adding new one
        clearGeneratedObjects();

        const objectData = JSON.parse(completion.content); // LLM response MUST be valid JSON
        console.log("Parsed LLM Response:", objectData);
        createObjectFromData(objectData);

    } catch (error) {
        console.error('Error during LLM interaction or object creation:', error);
        alert(`Failed to generate object. Error: ${error.message}. Check console for details.`);
        if (error.response) { // Log raw response if parsing failed
             console.error("Raw LLM response that caused error:", error.response);
        }
    } finally {
        generateButton.disabled = false;
        loadingIndicator.style.display = 'none';
        promptInput.disabled = false; // Re-enable input
        promptInput.value = ''; // Clear input after generation attempt
    }
});

function clearGeneratedObjects() {
    while (objectContainer.children.length > 0) {
        const child = objectContainer.children[0];
        objectContainer.remove(child);
        // Dispose geometry and material to free GPU memory
        if (child.geometry) {
            child.geometry.dispose();
        }
        if (child.material) {
            // If material is an array, dispose each element
            if (Array.isArray(child.material)) {
                child.material.forEach(material => material.dispose());
            } else {
                child.material.dispose();
            }
        }
    }
     console.log("Cleared previous objects.");
}


function createObjectFromData(data) {
    try {
        // --- Geometry Creation ---
        const GeometryClass = THREE[data.geometry.type];
        if (!GeometryClass) throw new Error(`Invalid geometry type: ${data.geometry.type}`);

        let geometry;
        const params = data.geometry.parameters || {};

        // Special handling for geometries requiring specific input formats
        if (data.geometry.type === 'LatheGeometry') {
            if (!params.points || !Array.isArray(params.points)) {
                throw new Error('LatheGeometry requires an array of points {x, y}.');
            }
            const points = params.points.map(p => new THREE.Vector2(p.x, p.y));
            geometry = new GeometryClass(points, params.segments, params.phiStart, params.phiLength);
        } else if (data.geometry.type === 'ExtrudeGeometry') {
             // Basic implementation - assumes a single shape for simplicity
             if (!params.shapes || !Array.isArray(params.shapes) || params.shapes.length === 0 || !params.shapes[0].path) {
                 throw new Error('ExtrudeGeometry requires shapes with path data.');
             }
             const shapeData = params.shapes[0];
             const shape = new THREE.Shape(shapeData.path.map(p => new THREE.Vector2(p.x, p.y)));
             if (shapeData.holes && Array.isArray(shapeData.holes)) {
                 shape.holes = shapeData.holes.map(holePath => new THREE.Path(holePath.map(p => new THREE.Vector2(p.x, p.y))));
             }
             const extrudeSettings = params.options || { depth: 1 }; // Ensure options exist
             geometry = new GeometryClass(shape, extrudeSettings);
        } else if (data.geometry.type === 'BufferGeometry') {
             if (!params.attributes || !params.attributes.position) {
                 throw new Error('BufferGeometry requires at least position attributes.');
             }
             geometry = new THREE.BufferGeometry();
             geometry.setAttribute('position', new THREE.Float32BufferAttribute(params.attributes.position, 3));
             if (params.attributes.normal) {
                 geometry.setAttribute('normal', new THREE.Float32BufferAttribute(params.attributes.normal, 3));
             } else {
                 geometry.computeVertexNormals(); // Calculate normals if not provided
             }
             if (params.attributes.uv) {
                 geometry.setAttribute('uv', new THREE.Float32BufferAttribute(params.attributes.uv, 2));
             }
             if (params.index) {
                 geometry.setIndex(params.index);
             }
        }
        else {
            // Standard geometries using ordered parameters from Three.js docs
             const geometryArgs = Object.values(params); // Simple approach, might need refinement based on specific geometry constructor signatures
             // console.log(`Creating ${data.geometry.type} with args:`, geometryArgs); // Debug log
            geometry = new GeometryClass(...geometryArgs);
        }

        // --- Material Creation ---
        const MaterialClass = THREE[data.material.type];
        if (!MaterialClass) throw new Error(`Invalid material type: ${data.material.type}`);

        const materialParams = { ...data.material.parameters };
        if (materialParams.color) {
            materialParams.color = new THREE.Color(materialParams.color);
        }
        if (materialParams.specular) { // For Phong
             materialParams.specular = new THREE.Color(materialParams.specular);
        }
        // Ensure opacity is applied correctly with transparency
        if (materialParams.transparent === true && materialParams.opacity === undefined) {
             materialParams.opacity = 1.0; // Default opacity if transparent is true but opacity isn't set
        } else if (materialParams.transparent !== true) {
            delete materialParams.opacity; // Don't set opacity if not transparent
        }


        // TODO: Handle textures if the LLM provides texture URLs/data (needs TextureLoader)

        const material = new MaterialClass(materialParams);

        // --- Mesh Creation & Setup ---
        const mesh = new THREE.Mesh(geometry, material);

        // Transformations
        mesh.position.set(data.position.x, data.position.y, data.position.z);
        mesh.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
        mesh.scale.set(data.scale.x, data.scale.y, data.scale.z);

        // Shadows
        mesh.castShadow = data.cast_shadow !== undefined ? data.cast_shadow : true; // Default true if not specified
        mesh.receiveShadow = data.receive_shadow !== undefined ? data.receive_shadow : false; // Default false

        // Add to the container group
        objectContainer.add(mesh);
        console.log(`Successfully added object: ${data.description || 'Generated Object'}`);

        // Optional: Focus camera on the new object
        // controls.target.copy(mesh.position);
        // camera.lookAt(mesh.position);

    } catch (error) {
        console.error("Error creating object from data:", error, "\nData received:", data);
        // Display error to user without crashing
        const errorMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
        const errorGeometry = new THREE.BoxGeometry(1, 1, 1);
        const errorCube = new THREE.Mesh(errorGeometry, errorMaterial);
        errorCube.position.set(0, 0.5, 0);
        objectContainer.add(errorCube); // Add error cube to container
        alert(`Failed to create object: ${error.message}. Displaying error indicator.`);
    }
}

