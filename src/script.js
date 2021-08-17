import './style.css'
import * as dat from 'dat.gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import vertices from './lines.json'
import xVertexShader from './shaders/xdirection/vertex.glsl'
import xFragmentShader from './shaders/xdirection/fragment.glsl'
import zVertexShader from './shaders/zdirection/vertex.glsl'
import zFragmentShader from './shaders/zdirection/fragment.glsl'
import z2VertexShader from './shaders/zdirection2/vertex.glsl'
import z2FragmentShader from './shaders/zdirection2/fragment.glsl'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { AdditiveBlending } from 'three'

const regularScene = 0
const bloomScene = 1

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const axes = new THREE.AxesHelper
axes.position.y = 20
scene.add(axes)


// lines
let left1 = [];
for (var i = 0; i < vertices.left1.length - 1; i++) {
    let x = vertices.left1[i][0];
    let y = vertices.left1[i][1];
    let z = vertices.left1[i][2];

    left1.push(new THREE.Vector3(x, y, z));
}


const firstXLeft1 = vertices.left1[0][0];
const lastXLeft1 = vertices.left1[vertices.left1.length - 1][0];
let lineLength = firstXLeft1 - lastXLeft1;
console.log(firstXLeft1)
console.log(lastXLeft1)
console.log(lineLength)


const tubeFloorMaterial = new THREE.ShaderMaterial({
    vertexShader: xVertexShader,
    fragmentShader: xFragmentShader,
    transparent: true,
    blending: AdditiveBlending,
    uniforms: {
        uTime: { value: 0 },
        uReactiveLength: { value: 0 },
        uLineLength: { value: 0 }
    }
})
const tubeGeometry1 = new THREE.TubeGeometry( new THREE.CatmullRomCurve3(left1), 100, 0.1, 8, true );
const tubeMesh1 = new THREE.Mesh( tubeGeometry1, tubeFloorMaterial );
scene.add( tubeMesh1 );
tubeMesh1.layers.enable(bloomScene);

let left2 = [];
for (var i = 0; i < vertices.left2.length - 1; i++) {
    let x = vertices.left2[i][0];
    let y = vertices.left2[i][1];
    let z = vertices.left2[i][2];

    left2.push(new THREE.Vector3(x, y, z));
}

const left2Material = new THREE.ShaderMaterial({
    vertexShader: zVertexShader,
    fragmentShader: zFragmentShader,
    transparent: true,
    blending: AdditiveBlending,
    uniforms: {
        uTime: { value: 0 },
        uReactiveLength: { value: 0 },
        uLineLength: { value: 0 }
    }
})

const left2Geometry = new THREE.TubeGeometry( new THREE.CatmullRomCurve3(left2), 100, 0.1, 8, true );
const left2Mesh = new THREE.Mesh( left2Geometry, left2Material );
scene.add( left2Mesh );
left2Mesh.layers.enable(bloomScene);

let left3 = [];
for (var i = 0; i < vertices.left3.length - 1; i++) {
    let x = vertices.left3[i][0];
    let y = vertices.left3[i][1];
    let z = vertices.left3[i][2];

    left3.push(new THREE.Vector3(x, y, z));
}

const left3Material = new THREE.ShaderMaterial({
    vertexShader: z2VertexShader,
    fragmentShader: z2FragmentShader,
    transparent: true,
    blending: AdditiveBlending,
    uniforms: {
        uTime: { value: 0 },
        uReactiveLength: { value: 0 },
        uLineLength: { value: 0 }
    }
})

const left3Geometry = new THREE.TubeGeometry( new THREE.CatmullRomCurve3(left3), 100, 0.1, 8, true );
const left3Mesh = new THREE.Mesh( left3Geometry, left3Material );
scene.add( left3Mesh );
left3Mesh.layers.enable(bloomScene);




/**
 * Base
 */
// Debug
const debugObject = {}

const gui = new dat.GUI({
    width: 400
})



/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()



// GLTF loader
const gltfLoader = new GLTFLoader()


/**
 * Textures
 */
const bakedTexture = textureLoader.load('blend/bakedFox.jpg')
bakedTexture.flipY = false
bakedTexture.encoding = THREE.sRGBEncoding

/**
 * Materials
 */
// Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })


/**
 * Model
 */
gltfLoader.load(
    'blend/FoxDeliv.glb',
    (gltf) =>
    {
        scene.add(gltf.scene)

        gltf.scene.traverse((child) =>
        {
            child.material = bakedMaterial
        })

        const floor = gltf.scene.children.find((child) => child.name === 'Plane006')

        // floor.material.blending = AdditiveBlending

        console.log(gltf.scene)
    }
)



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
camera.position.x = 40
camera.position.y = 40
camera.position.z = 20
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.outputEncoding = THREE.sRGBEncoding
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.autoClear = false
renderer.outputEncoding = THREE.sRGBEncoding

// render target
let RenderTargetClass = null

if (renderer.getPixelRatio() === 1 && renderer.capabilities.isWebGL2)
{
    RenderTargetClass = THREE.WebGLMultisampleRenderTarget
    console.log("Multi")
}
else
{
    RenderTargetClass = THREE.WebGLRenderTarget
    console.log("Not Multi")
}
const renderTarget = new THREE.WebGLRenderTarget(
    800,
    600,
    {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        encoding: THREE.sRGBEncoding
    }
)

// composer
const composer = new EffectComposer( renderer, renderTarget )
composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
composer.setSize(sizes.width, sizes.height)

// render pass
const renderScene = new RenderPass(scene, camera)
composer.addPass( renderScene )


// bloom pass
const unrealBloomPass = new UnrealBloomPass()
unrealBloomPass.strength = .1
unrealBloomPass.radius = 1
unrealBloomPass.threshold = 0
composer.addPass( unrealBloomPass )


let scrollY = 0;
let clientHeight = window.document.body.clientHeight;

window.addEventListener("scroll", function () {
    scrollY = window.scrollY;
    clientHeight = window.document.body.clientHeight;
})


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    tubeFloorMaterial.uniforms.uTime.value = elapsedTime;
    tubeFloorMaterial.uniforms.uReactiveLength.value = ((scrollY / clientHeight) * 75.0);
    tubeFloorMaterial.uniforms.uLineLength.value = lineLength;
    
    left2Material.uniforms.uTime.value = elapsedTime;
    left2Material.uniforms.uReactiveLength.value = ((scrollY / clientHeight) * 75.0);
    left2Material.uniforms.uLineLength.value = lineLength;
    
    left3Material.uniforms.uTime.value = elapsedTime;
    left3Material.uniforms.uReactiveLength.value = ((scrollY / clientHeight) * 75.0);
    left3Material.uniforms.uLineLength.value = lineLength;
    
    // Update controls
    controls.update()

    // Render
    // camera.layers.set(1);
    
    composer.render();

    // renderer.clearDepth();
    // camera.layers.set(0);

    // renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()