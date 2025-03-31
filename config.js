export const threeJsTechniques = {
  "introduction": "This outlines advanced techniques for creating realistic and complex objects in Three.js beyond basic primitives.",
  "techniques": [
    {
      "name": "Constructive Solid Geometry (CSG)",
      "description": "Combining or subtracting basic shapes to create complex forms. Uses libraries like three-csg-ts.",
      "use_cases": ["Creating objects with holes, cutouts, or complex intersections (e.g., a pipe joint, a hollowed-out sphere)."],
      "implementation_details": "Involves creating Mesh objects for the base shapes and then using CSG operations (union, subtract, intersect) to generate a new combined mesh.",
      "keywords": ["CSG", "boolean operations", "subtract", "union", "intersect", "three-csg-ts"]
    },
    {
      "name": "Parametric Geometry & Surfaces",
      "description": "Defining geometry using mathematical equations. Three.js provides `ParametricGeometry`.",
      "use_cases": ["Generating complex curves and surfaces like Mobius strips, Klein bottles, mathematical knots, custom terrains."],
      "implementation_details": "Requires a function that takes parameters (u, v) typically ranging from 0 to 1, and returns a THREE.Vector3 representing a point on the surface.",
      "keywords": ["parametric", "mathematical surface", "ParametricGeometry", "equations", "curves"]
    },
    {
      "name": "Lathe Geometry",
      "description": "Creating shapes by revolving a 2D profile (a series of points) around an axis. Uses `LatheGeometry`.",
      "use_cases": ["Creating symmetrical objects like vases, bottles, lamp bases, chess pieces."],
      "implementation_details": "Define a path using an array of THREE.Vector2 points. `LatheGeometry` takes these points and parameters like the number of segments and the angle of revolution.",
      "keywords": ["lathe", "revolve", "sweep", "profile", "LatheGeometry", "symmetry"]
    },
    {
      "name": "Extrude Geometry",
      "description": "Creating 3D shapes by extruding a 2D shape along a path or depth. Uses `ExtrudeGeometry`.",
      "use_cases": ["Generating objects with depth like text, logos, gears, custom profiles extruded along curves."],
      "implementation_details": "Define a `THREE.Shape` for the 2D profile. Extrusion options allow control over depth, beveling, and extrusion along a `THREE.CurvePath`.",
      "keywords": ["extrude", "extrusion", "shape", "profile", "depth", "bevel", "ExtrudeGeometry", "TextGeometry"]
    },
    {
      "name": "Displacement Mapping",
      "description": "Using a texture (displacement map) to offset vertices of a mesh along their normals, creating detailed surface variations.",
      "use_cases": ["Adding realistic bumps, wrinkles, terrain details, complex patterns without increasing polygon count significantly."],
      "implementation_details": "Applied via material properties (`displacementMap`, `displacementScale`, `displacementBias`). Requires a mesh with sufficient vertex density to show detail. Often used with `MeshStandardMaterial` or `MeshPhysicalMaterial`.",
      "keywords": ["displacement map", "height map", "bump mapping (conceptual relative)", "surface detail", "terrain", "wrinkles"]
    },
    {
      "name": "Normal Mapping",
      "description": "Using a texture (normal map) to simulate high-detail surface bumps and dents by manipulating how light reflects off the surface, without actually changing the geometry.",
      "use_cases": ["Adding fine details like pores, scratches, wood grain, screw heads, panel lines efficiently."],
      "implementation_details": "Applied via material properties (`normalMap`, `normalScale`). Requires tangent-space normal maps (usually bluish images). Enhances perceived detail on lower-poly models.",
      "keywords": ["normal map", "bump map (simulated)", "surface detail", "lighting", "shading", "fake geometry"]
    },
    {
      "name": "Physically Based Rendering (PBR)",
      "description": "A set of rendering techniques that aim to simulate the physical properties of light and materials more accurately. Uses `MeshStandardMaterial` or `MeshPhysicalMaterial`.",
      "use_cases": ["Creating realistic materials like metals, plastics, wood, glass, cloth by controlling properties like roughness, metalness, clearcoat, transmission."],
      "implementation_details": "Requires textures for properties like base color (albedo), metallic, roughness, ambient occlusion (AO), and potentially normal/displacement maps. Proper lighting setup (e.g., environment maps) is crucial.",
      "keywords": ["PBR", "MeshStandardMaterial", "MeshPhysicalMaterial", "realistic materials", "metalness", "roughness", "albedo", "ambient occlusion", "environment map"]
    },
    {
      "name": "Procedural Generation",
      "description": "Generating geometry, textures, or entire scenes algorithmically rather than manually modeling them.",
      "use_cases": ["Creating vast terrains, complex patterns, randomized object placements, organic shapes, fractals."],
      "implementation_details": "Involves writing JavaScript code that uses loops, randomness (e.g., Perlin noise), mathematical formulas, or algorithms (like L-systems for plants) to define vertices, faces, colors, or object positions.",
      "keywords": ["procedural", "algorithmic", "generated", "noise", "Perlin noise", "fractals", "L-systems", "random"]
    },
    {
        "name": "Tube Geometry",
        "description": "Creating a tube shape along a 3D curve. Uses `TubeGeometry`.",
        "use_cases": ["Pipes, wires, ropes, roller coaster tracks, paths."],
        "implementation_details": "Requires a `THREE.Curve` object defining the path. Parameters control the tube's radius, number of segments along the length, and radial segments.",
        "keywords": ["tube", "pipe", "wire", "path", "curve", "TubeGeometry"]
      },
      {
        "name": "Shape Geometry",
        "description": "Creating a flat (2D) shape from one or more paths, potentially with holes. Uses `ShapeGeometry`.",
        "use_cases": ["Creating flat custom shapes, panels with cutouts, 2D logos."],
        "implementation_details": "Define a `THREE.Shape` which can include an outer path and multiple hole paths defined using `moveTo`, `lineTo`, `quadraticCurveTo`, etc.",
        "keywords": ["shape", "flat", "2D", "panel", "cutout", "hole", "ShapeGeometry"]
      },
       {
        "name": "BufferGeometry (Manual Creation)",
        "description": "Directly defining vertices, normals, UVs, colors, and indices for maximum control over geometry.",
        "use_cases": ["Highly optimized geometry, custom data structures, particle systems, complex shapes not easily made with standard geometries."],
        "implementation_details": "Involves creating and populating `Float32Array` buffers for attributes like `position`, `normal`, `uv`, and potentially an `Uint16Array` or `Uint32Array` for `index`.",
        "keywords": ["BufferGeometry", "vertices", "indices", "attributes", "custom geometry", "performance", "optimization"]
      }
  ],
   "notes": "Many techniques can be combined. For example, you might use LatheGeometry to create a vase shape, and then apply PBR materials with normal and displacement maps for surface detail."
};
`````` index.html
<!DOCTYPE html>
<html>
<head>
    <title>Three.js 3D Scene Generator</title>
    <style>
        body { margin: 0; overflow: hidden; } /* Prevent scrollbars */
        canvas { display: block; }
        #controls { position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.7); padding: 15px; color: white; border-radius: 8px; font-family: sans-serif; }
        input[type="text"] { padding: 8px; border-radius: 4px; border: 1px solid #ccc; min-width: 250px; margin-right: 5px;}
        button { padding: 8px 15px; border-radius: 4px; border: none; background-color: #4CAF50; color: white; cursor: pointer; transition: background-color 0.3s; }
        button:hover { background-color: #45a049; }
        button:disabled { background-color: #cccccc; cursor: not-allowed; }
        #loadingIndicator { display: none; margin-left: 10px; font-style: italic;}
    </style>
</head>
<body>
    <div id="controls">
        <input type="text" id="promptInput" placeholder="e.g., 'a red metal cube', 'a vase made of glass'">
        <button id="generateButton">Generate</button>
        <span id="loadingIndicator">Generating...</span>
    </div>
    <script type="importmap">
        {
            "imports": {
                "three": "https://cdn.jsdelivr.net/npm/three@0.163.0/build/three.module.js",
                "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.163.0/examples/jsm/"
            }
        }
    </script>
    <script type="module" src="main.js"></script>
</body>
</html>

// This file stores configuration data, including the detailed Three.js techniques
// which will be provided to the LLM as context.

export const threeJsTechniques = {
  "introduction": "This document outlines various techniques available in Three.js for creating 3D objects, ranging from basic primitives to complex, detailed models. Use this information to select appropriate methods when generating object parameters based on user prompts.",
  "geometry_types": [
    // --- Basic Primitives ---
    {
      "name": "BoxGeometry",
      "description": "A rectangular prism (cube or cuboid).",
      "parameters": ["width", "height", "depth", "widthSegments?", "heightSegments?", "depthSegments?"],
      "use_cases": ["Cubes, boxes, walls, simple structures."]
    },
    {
      "name": "SphereGeometry",
      "description": "A sphere.",
      "parameters": ["radius", "widthSegments?", "heightSegments?", "phiStart?", "phiLength?", "thetaStart?", "thetaLength?"],
      "use_cases": ["Balls, planets, spherical objects."]
    },
    {
      "name": "CylinderGeometry",
      "description": "A cylinder.",
      "parameters": ["radiusTop", "radiusBottom", "height", "radialSegments?", "heightSegments?", "openEnded?", "thetaStart?", "thetaLength?"],
      "use_cases": ["Pipes, columns, cans, cones (if radiusTop or radiusBottom is 0)."]
    },
    {
      "name": "ConeGeometry",
      "description": "A cone. (Essentially CylinderGeometry with radiusTop or radiusBottom = 0).",
      "parameters": ["radius", "height", "radialSegments?", "heightSegments?", "openEnded?", "thetaStart?", "thetaLength?"],
      "use_cases": ["Cones, spikes, pointed roofs."]
    },
    {
      "name": "PlaneGeometry",
      "description": "A flat rectangular plane.",
      "parameters": ["width", "height", "widthSegments?", "heightSegments?"],
      "use_cases": ["Ground, walls, flat surfaces, images/textures display."]
    },
    {
      "name": "TorusGeometry",
      "description": "A torus (donut shape).",
      "parameters": ["radius", "tube", "radialSegments?", "tubularSegments?", "arc?"],
      "use_cases": ["Donuts, rings, tires."]
    },
    {
        "name": "TorusKnotGeometry",
        "description": "A complex knot shape winding around a torus.",
        "parameters": ["radius?", "tube?", "tubularSegments?", "radialSegments?", "p?", "q?"],
        "use_cases": ["Decorative knots, abstract shapes, mathematical visualizations."]
    },
    // --- Polyhedrons ---
     {
      "name": "DodecahedronGeometry",
      "description": "A 12-sided polyhedron.",
      "parameters": ["radius?", "detail?"],
      "use_cases": ["Geometric shapes, dice (d12)."]
    },
    {
      "name": "IcosahedronGeometry",
      "description": "A 20-sided polyhedron.",
      "parameters": ["radius?", "detail?"],
      "use_cases": ["Geometric shapes, dice (d20), geodesic dome bases."]
    },
    {
      "name": "OctahedronGeometry",
      "description": "An 8-sided polyhedron.",
      "parameters": ["radius?", "detail?"],
      "use_cases": ["Geometric shapes, dice (d8), crystals."]
    },
    {
      "name": "TetrahedronGeometry",
      "description": "A 4-sided polyhedron (pyramid with triangular base).",
      "parameters": ["radius?", "detail?"],
      "use_cases": ["Geometric shapes, dice (d4), simple pyramids."]
    },

    // --- Advanced & Custom Geometry ---
    {
      "name": "LatheGeometry",
      "description": "Creates shapes by revolving a 2D profile (a series of Vector2 points) around the Y-axis.",
      "parameters": ["points: Array<Vector2>", "segments?", "phiStart?", "phiLength?"],
      "use_cases": ["Symmetrical objects like vases, bottles, lamp bases, chess pieces."],
      "parameter_notes": ["'points' must be an array of {x, y} objects."]
    },
    {
      "name": "ExtrudeGeometry",
      "description": "Creates 3D shapes by extruding a 2D shape (defined by a Shape or array of Shapes) along a depth or path.",
      "parameters": ["shapes: Shape | Array<Shape>", "options: object"],
      "use_cases": ["3D text, logos, gears, custom profiles, objects with defined thickness/bevels."],
      "parameter_notes": ["'shapes' requires paths (array of {x,y}) and optional holes. 'options' object includes 'depth', 'bevelEnabled', 'bevelThickness', 'bevelSize', etc. Keep shapes simple for LLM generation."]
    },
     {
      "name": "TubeGeometry",
      "description": "Creates a tube shape along a 3D curve (defined by a Curve object).",
      "parameters": ["path: Curve", "tubularSegments?", "radius?", "radialSegments?", "closed?"],
      "use_cases": ["Pipes, wires, ropes, paths, roller coaster tracks."],
      "parameter_notes": ["Requires defining a THREE.Curve subclass (e.g., LineCurve3, CatmullRomCurve3). LLM might struggle to define complex paths."]
    },
    {
      "name": "ShapeGeometry",
      "description": "Creates a flat (2D) shape from one or more paths (Shapes), potentially with holes.",
      "parameters": ["shapes: Shape | Array<Shape>", "curveSegments?"],
      "use_cases": ["Flat custom shapes, panels with cutouts, 2D logos to display textures."],
      "parameter_notes": ["Similar path definition to ExtrudeGeometry."]
    },
    {
       "name": "BufferGeometry",
       "description": "The most fundamental geometry type. Allows direct definition of vertices, faces (indices), normals, colors, UVs. Highly flexible but complex to define manually or for an LLM.",
       "parameters": ["Requires setting attributes (position, normal, uv, etc.) and potentially indices directly."],
       "use_cases": ["Optimized geometry, particle systems, complex shapes not possible with other generators, importing model data."],
       "parameter_notes": ["LLM should avoid generating this unless absolutely necessary and the prompt provides extremely specific vertex data."]
     }
    // Note: ParametricGeometry exists but is complex for LLM generation. CSG requires external libraries.
  ],
  "material_types": [
    {
      "name": "MeshBasicMaterial",
      "description": "Simple material not affected by lights. Renders geometry with a plain color or texture.",
      "parameters": ["color?", "map?", "wireframe?", "transparent?", "opacity?"],
      "use_cases": ["Debugging, unlit scenes, simple cartoonish styles, UI elements."]
    },
    {
      "name": "MeshNormalMaterial",
      "description": "Maps the normal vectors to RGB colors. Useful for visualizing surface orientation.",
      "parameters": ["wireframe?", "flatShading?", "transparent?", "opacity?"],
      "use_cases": ["Debugging normals, geometric visualization."]
    },
     {
      "name": "MeshDepthMaterial",
      "description": "Renders geometry based on its distance from the camera's near and far planes. Black is near, white is far.",
      "parameters": ["wireframe?", "map?", "alphaMap?"],
      "use_cases": ["Depth visualization, post-processing effects like Depth of Field."]
    },
    {
      "name": "MeshLambertMaterial",
      "description": "Simple lit material, computes lighting only at vertices. Good performance, but can look faceted (flat shading) or less detailed.",
      "parameters": ["color?", "map?", "emissive?", "emissiveMap?", "emissiveIntensity?", "wireframe?", "transparent?", "opacity?"],
      "use_cases": ["Simple lit objects, performance-sensitive applications, matte surfaces."]
    },
    {
      "name": "MeshPhongMaterial",
      "description": "Lit material with specular highlights computed per pixel. More realistic than Lambert, good for shiny surfaces.",
      "parameters": ["color?", "map?", "specular?", "specularMap?", "shininess?", "emissive?", "emissiveMap?", "emissiveIntensity?", "normalMap?", "displacementMap?", "wireframe?", "transparent?", "opacity?"],
      "use_cases": ["Shiny plastics, polished surfaces, objects requiring clear highlights."]
    },
    {
      "name": "MeshStandardMaterial",
      "description": "Physically Based Rendering (PBR) material using metallic-roughness workflow. Standard for realistic rendering.",
      "parameters": ["color?", "map?", "roughness?", "roughnessMap?", "metalness?", "metalnessMap?", "emissive?", "emissiveMap?", "emissiveIntensity?", "normalMap?", "displacementMap?", "aoMap?", "envMap?", "wireframe?", "flatShading?", "transparent?", "opacity?"],
      "use_cases": ["Most realistic materials (metals, plastics, wood, stone, cloth), standard for modern workflows."]
    },
    {
      "name": "MeshPhysicalMaterial",
      "description": "An extension of MeshStandardMaterial providing more advanced PBR properties.",
      "parameters": ["(All MeshStandardMaterial params plus)", "clearcoat?", "clearcoatMap?", "clearcoatRoughness?", "clearcoatRoughnessMap?", "ior?", "reflectivity?", "transmission?", "transmissionMap?", "thickness?", "thicknessMap?", "attenuationDistance?", "attenuationColor?"],
      "use_cases": ["Advanced realistic materials: glass (transmission), car paint (clearcoat), coated surfaces, complex plastics."]
    }
  ],
  "advanced_concepts": [
    {
      "name": "Physically Based Rendering (PBR)",
      "description": "Using MeshStandardMaterial or MeshPhysicalMaterial with properties like roughness, metalness (and optionally clearcoat, transmission) to simulate real-world light interaction. Often involves texture maps (albedo, roughness, metallic, normal, AO).",
      "keywords": ["PBR", "realistic", "metalness", "roughness", "clearcoat", "transmission", "glass", "metal", "plastic", "wood"]
    },
    {
      "name": "Normal Mapping",
      "description": "Using a `normalMap` texture with MeshPhong, Standard, or Physical materials to simulate fine surface detail (bumps, dents) without adding more geometry. Affects lighting.",
      "keywords": ["normal map", "bump", "detail", "surface", "texture", "lighting"]
    },
    {
      "name": "Displacement Mapping",
      "description": "Using a `displacementMap` texture to actually offset vertices based on texture values, creating real geometric surface detail. Requires sufficient geometry subdivisions. Affects geometry.",
      "keywords": ["displacement map", "height map", "geometry", "detail", "terrain", "wrinkles"]
    },
    {
        "name": "Environment Mapping",
        "description": "Using a cube texture (`envMap`) on reflective/metallic materials (Standard/Physical) to reflect the surroundings, greatly enhancing realism.",
        "keywords": ["environment map", "envMap", "reflection", "metallic", "chrome", "realistic"]
      },
       {
        "name": "Transparency and Opacity",
        "description": "Setting `transparent: true` and adjusting `opacity` (0.0-1.0) on materials to make objects see-through.",
        "keywords": ["transparent", "opacity", "see-through", "glass", "ghost"]
      },
      {
        "name": "Wireframe",
        "description": "Setting `wireframe: true` on any material to render only the edges of the geometry.",
        "keywords": ["wireframe", "edges", "lines", "debug"]
      }
    // CSG/Procedural Generation are complex processes usually done in code, harder for LLM to dictate fully via JSON.
  ],
  "notes": "Parameters marked with '?' are optional. The LLM should prioritize 'geometry.type', 'geometry.parameters', 'material.type', and 'material.parameters.color', inferring other parameters (like roughness/metalness for StandardMaterial) based on the prompt's description (e.g., 'shiny metal' vs 'dull plastic'). Default positions/rotations/scales are acceptable unless specified."
};

