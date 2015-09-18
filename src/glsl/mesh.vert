
varying vec4 vPosition;

uniform float uTime;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

void main() {

    vec3 pos = position;

    pos.x += snoise3(vec3(pos.x * 0.1, pos.y * 0.1, uTime * 1.0)) * 2.0 +  snoise3(vec3(pos.x * 0.01, pos.y * 0.01 + 2.0, uTime * 1.6 - 321.0)) * 30.0;
    pos.y += snoise3(vec3(pos.x * 0.1, pos.y * 0.1, uTime * 1.0 + 3.0)) * 3.0 +  snoise3(vec3(pos.x * 0.01, pos.y * 0.01 + 2.0, uTime * 1.4 + 2.0)) * 30.0;
    pos.z += snoise3(vec3(pos.x * 0.1, pos.y * 0.1, uTime * 1.0 + 4.0)) * 5.0 +  snoise3(vec3(pos.x * 0.01, pos.y * 0.01 + 2.0, uTime * 1.8 + 332.0)) * 30.0;

    vPosition = modelViewMatrix * vec4( pos, 1.0 );

    gl_Position = projectionMatrix * vPosition;

}
