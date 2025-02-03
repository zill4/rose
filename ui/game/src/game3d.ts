import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Chess } from 'chess.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface Piece3D {
  type: string;
  color: 'white' | 'black';
  position: [number, number];
}

interface Board3DConfig {
  fen: string;
  orientation: 'white' | 'black';
  viewOnly?: boolean;
  pieces?: Piece3D[];
}

export class ChessBoard3D {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private pieces: Map<string, THREE.Object3D> = new Map();
  private squareSize = 1;
  private boardGroup: THREE.Group;

  constructor(private element: HTMLElement, private config: Board3DConfig) {
    this.init();
  }

  private init() {
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x121212);

    // Camera setup
    const aspect = this.element.clientWidth / this.element.clientHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    this.camera.position.set(4, 6, 4);
    this.camera.lookAt(4, 0, 4);

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      shadowMap: true
    });
    this.renderer.setSize(this.element.clientWidth, this.element.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.element.appendChild(this.renderer.domElement);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enablePan = false;
    this.controls.minDistance = 5;
    this.controls.maxDistance = 20;
    this.controls.target.set(3.5, 0, 3.5);

    // Lighting
    this.setupLighting();

    // Create board
    this.boardGroup = new THREE.Group();
    this.scene.add(this.boardGroup);
    this.createBoard();
    
    // Start animation loop
    this.animate();

    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());
  }

  private setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 10, 7.5);
    this.scene.add(directionalLight);
  }

  private createBoard() {
    const boardGeometry = new THREE.PlaneGeometry(8, 8);
    const boardMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide
    });
    const boardMesh = new THREE.Mesh(boardGeometry, boardMaterial);
    boardMesh.rotation.x = Math.PI / 2;
    this.boardGroup.add(boardMesh);

    // Create squares
    for (let x = 0; x < 8; x++) {
      for (let z = 0; z < 8; z++) {
        const isWhite = (x + z) % 2 === 0;
        const squareGeometry = new THREE.PlaneGeometry(1, 1);
        const squareMaterial = new THREE.MeshPhongMaterial({
          color: isWhite ? 0xEEEED2 : 0x769656
        });
        const square = new THREE.Mesh(squareGeometry, squareMaterial);
        square.rotation.x = -Math.PI / 2;
        square.position.set(x, 0, z);
        this.boardGroup.add(square);
      }
    }
  }

  private onWindowResize() {
    const width = this.element.clientWidth;
    const height = this.element.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  // Public methods for game integration
  public setPieces(pieces: Piece3D[]) {
    // TODO: Implement piece placement
  }

  public movePiece(from: string, to: string) {
    // TODO: Implement piece movement
  }

  public destroy() {
    this.renderer.dispose();
    this.element.removeChild(this.renderer.domElement);
    window.removeEventListener('resize', () => this.onWindowResize());
  }
}

function init3DBoard(container: HTMLElement) {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Board geometry
    const boardGeometry = new THREE.PlaneGeometry(8, 8);
    const boardMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide
    });
    const boardMesh = new THREE.Mesh(boardGeometry, boardMaterial);
    boardMesh.rotation.x = Math.PI / 2;
    scene.add(boardMesh);

    // Camera positioning
    camera.position.set(4, 6, 4);
    camera.lookAt(4, 0, 4);

    // Renderer setup
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
    
    return { scene, camera, renderer };
}

export { init3DBoard }; 