
varying vec4 vPosition;

uniform float uTime;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

void main() {

    vec3 pos = position;

    pos.z = snoise3(vec3(pos.x * 0.1, pos.y * 0.1, uTime * 1.0)) * 3.0 +  snoise3(vec3(pos.x * 0.005, pos.y * 0.005 + 2.0, uTime * 0.3)) * 15.0;

    vPosition = modelViewMatrix * vec4( pos, 1.0 );

    gl_Position = projectionMatrix * vPosition;


}
