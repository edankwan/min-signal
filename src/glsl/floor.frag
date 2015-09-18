#extension GL_OES_standard_derivatives : enable

varying vec4 vPosition;

uniform vec3 fogColor;
uniform float fogDensity;

void main() {

    vec3 dX = dFdx(vPosition.xyz);
    vec3 dY = dFdy(vPosition.xyz);
    vec3 normal = normalize(cross(dX, dY));

    vec3 light = normalize(vec3(1.0, 1.0, 1.0) - vPosition.xyz);

    float v = dot(light, normal);


    vec4 color = vec4( 0.9, 0.9, 0.9, 1.0 );
    color.rgb += v * 0.1;

    gl_FragColor = color;

    float depth = gl_FragCoord.z / gl_FragCoord.w;
    float fogFactor = 0.0;
    const float LOG2 = 1.442695;
    fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );
    fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );
    gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );

}
