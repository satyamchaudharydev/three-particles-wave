import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/4.png')

// Particles

// geometry
// const particlesGeometry = new THREE.SphereGeometry(1, 32, 32 )

// // material
// const particlesMaterial = new THREE.PointsMaterial({
//     size: 0.02,
//     sizeAttenuation: true
// })
// const particles = new THREE.Points(particlesGeometry, particlesMaterial)
// scene.add(particles) 

const debugOptions = {
    particlesLength: 10,
}
const geometry = new THREE.BufferGeometry()
const count = 50000
const positionsArray = new Float32Array(count * 3)
const colorsArray = new Float32Array(count * 3)


for(let i = 0; i < count * 3; i++){
    positionsArray[i] = (Math.random() - 0.5) * debugOptions.particlesLength
    colorsArray[i] = Math.random()

}
gui.add(debugOptions, 'particlesLength').min(1).max(100).step(1).onChange(() => {
    for(let i = 0; i < count * 3; i++){
        positionsArray[i] = (Math.random() - 0.5) * debugOptions.particlesLength
    }
    geometry.attributes.position.needsUpdate = true
})
geometry.setAttribute('position', new THREE.BufferAttribute(positionsArray, 3))
geometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3))


const material = new THREE.PointsMaterial({
    size: 0.1,
    // color: "#ff88cc",
    sizeAttenuation: true,
    alphaMap: particleTexture,
    transparent: true,
})
// material.alphaTest = 0.001  
// material.depthTest = fal se
material.depthWrite = false
material.blending = THREE.AdditiveBlending
material.vertexColors = true

const points = new THREE.Points(geometry, material)
scene.add(points)
/**
 * Test cube
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()

)
// scene.add(cube)

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    // points.rotation.y = elapsedTime * 0.2
    // points.position.y = -elapsedTime * 0.2
    for(let i = 0; i < count; i++){
        const i3 = i * 3
        const x = geometry.attributes.position.array[i3]
        geometry.attributes.position.array[i3 + 1] = Math.sin(x + elapsedTime * 2)
        // geometry.attributes.position.array[i3 + 2] = Math.cos(x + elapsedTime * 2)
        geometry.attributes.position.needsUpdate = true
    
    }
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()