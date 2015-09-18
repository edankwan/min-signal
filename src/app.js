var stageReference = require('./core/stageReference');
var glslify = require('glslify');
var THREE = require('three');

var undef;

var _width = 0;
var _height = 0;
var _time = 0;

var _camera;
var _scene;
var _renderer;

var _meshes = [];
var _floor;
var _showAnimation = 0;

var _doc = document;
var _body = _doc.body;
var _docElement = _doc.documentElement;

function init() {

    stageReference.init();

    _camera = new THREE.PerspectiveCamera( 45, 1, 1, 3000);
    _camera.position.z = 1000;
    _scene = new THREE.Scene();

    _scene.fog = new THREE.FogExp2( 0xffffff, 0.01 );

    _renderer = new THREE.WebGLRenderer({
        // alpha : true
    });
    _renderer.setClearColor(0xffffff);
    _body.insertBefore(_renderer.domElement, _body.children[0]);

    _createMesh(50, 2, 150, -20, 450, 0);
    _createMesh(60, 2, -30, 90, 650, 21);
    _createMesh(140, 2, 850, 300, -100, 65);
    _createMesh(240, 2, -550, 200, 300, 32);
    _createMesh(60, 2, 220, 200, -90, 8);
    _createMesh(130, 2, 520, 150, -20, 51);
    _createMesh(40, 2, -120, -20, 560, 26);
    _createMesh(30, 2, -10, 10, 21, 22);
    _createFloor();


    stageReference.onResized.add(_onResize);
    stageReference.onRendered.add(_render);
    stageReference.startRender();
    _onResize();

}

function _createMesh(size, quality, x, y, z, t) {

    var meshGeometry = new THREE.IcosahedronGeometry(size, quality);
    meshGeometry.verticesNeedUpdate = true;
    meshGeometry.normalsNeedUpdate = true;
    meshGeometry.uvsNeedUpdate = true;
    meshGeometry.computeTangents();
    var meshMaterial = new THREE.ShaderMaterial( {
        fog: true,
        uniforms: {
            uTime : { type: 'f', value: t },
            fogDensity : { type: 'f', value: 0.00025 },
            fogColor : { type: 'c', value: new THREE.Color( 0xffffff ) }
        },
        shading: THREE.SmoothShading,
        vertexShader: glslify('./glsl/mesh.vert'),
        fragmentShader: glslify('./glsl/mesh.frag'),
        depthWrite: true
    } );
    var mesh = new THREE.Mesh(meshGeometry, meshMaterial);
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.z = z;
    mesh.y = y;
    mesh.x = x;
    mesh.position.z = z;
    _meshes.push(mesh);

    _scene.add(mesh);

}

function _createFloor() {

    var floorGeometry = new THREE.PlaneBufferGeometry(3000, 3000, 300, 300);
    var floorMaterial = new THREE.ShaderMaterial( {
        fog: true,
        uniforms: {
            uTime : { type: 'f', value: 0 },
            fogDensity : { type: 'f', value: 0.00025 },
            fogColor : { type: 'c', value: new THREE.Color( 0xffffff ) }
        },
        attributes: floorGeometry.attributes,
        vertexShader: glslify('./glsl/floor.vert'),
        fragmentShader: glslify('./glsl/floor.frag'),
        depthWrite: true
    } );
    _floor = new THREE.Mesh(floorGeometry, floorMaterial);
    _floor.position.y = -100;
    _floor.rotation.x = -Math.PI / 2;

    _scene.add(_floor);

}


function _onResize() {
    _width = stageReference.stageWidth;
    _height = stageReference.stageHeight;

    _camera.aspect = _width / _height;
    _camera.updateProjectionMatrix();
    _renderer.setSize(_width, _height);
    _render();
}

function _render(dt) {

    var scrollTop = _doc.body.scrollTop || _docElement.scrollTop;
    var maxScrollTop = (_docElement.scrollHeight - _docElement.clientHeight) || 1;
    var scrollRatio = scrollTop / maxScrollTop;

    dt = (dt || 0) * 0.001;
    _time += dt;

    for(var i = 0, len = _meshes.length; i < len; ++i) {
        _meshes[i].material.uniforms.uTime.value += dt;
        _meshes[i].position.x = Math.sin(_meshes[i].material.uniforms.uTime.value) * 40 + _meshes[i].x;
        _meshes[i].position.y = Math.sin(_meshes[i].material.uniforms.uTime.value + 623.41) * 40 + _meshes[i].y;
        _meshes[i].position.z = Math.sin(_meshes[i].material.uniforms.uTime.value + 21.41) * 40 + _meshes[i].z;
    }
    _floor.material.uniforms.uTime.value = _time;

    _showAnimation += (1 - _showAnimation) * 0.01;

    _camera.position.y = 200 - _showAnimation * 200 - scrollRatio * 100;
    _camera.position.z = 1300 - _showAnimation * 200 - scrollRatio * 300;
    _camera.lookAt(new THREE.Vector3());

    _scene.fog.density += (0.001 - _scene.fog.density) * 0.15;

    _renderer.render( _scene, _camera );

}

init();
