#version 460

#ifndef BASICREFTYPES_GLSL
#define BASICREFTYPES_GLSL

#extension GL_EXT_scalar_block_layout: enable
#extension GL_EXT_buffer_reference2 : enable
//for uint64_t etc...
#extension GL_EXT_shader_explicit_arithmetic_types         : enable
#extension GL_EXT_shader_explicit_arithmetic_types_int8    : enable
#extension GL_EXT_shader_explicit_arithmetic_types_int16   : enable
#extension GL_EXT_shader_explicit_arithmetic_types_int32   : enable
#extension GL_EXT_shader_explicit_arithmetic_types_int64   : enable
#extension GL_EXT_shader_explicit_arithmetic_types_float16 : enable
#extension GL_EXT_shader_explicit_arithmetic_types_float32 : enable
#extension GL_EXT_shader_explicit_arithmetic_types_float64 : enable

layout(buffer_reference, buffer_reference_align=4, scalar) buffer float32_array{
    float32_t data[];
};
layout(buffer_reference, buffer_reference_align=8, scalar) buffer f32vec2_array{
    f32vec2 data[];
};
layout(buffer_reference, buffer_reference_align=16, scalar) buffer f32vec3_array{
    f32vec3 data[];
};
layout(buffer_reference, buffer_reference_align=32, scalar) buffer f32vec4_array{
    f32vec4 data[];
};

layout(buffer_reference, buffer_reference_align=8, scalar) buffer float64_array{
    float64_t data[];
};
layout(buffer_reference, buffer_reference_align=4, scalar) buffer f64vec2_array{
    f64vec2 data[];
};
layout(buffer_reference, buffer_reference_align=4, scalar) buffer f64vec3_array{
    f64vec3 data[];
};
layout(buffer_reference, buffer_reference_align=4, scalar) buffer f64vec4_array{
    f64vec4 data[];
};

layout(buffer_reference, buffer_reference_align=1, scalar) buffer uint8_array{
    uint8_t data[];
};
layout(buffer_reference, buffer_reference_align=1, scalar) buffer u8vec2_array{
    u8vec2 data[];
};
layout(buffer_reference, buffer_reference_align=1, scalar) buffer u8vec3_array{
    u8vec3 data[];
};
layout(buffer_reference, buffer_reference_align=1, scalar) buffer u8vec4_array{
    u8vec4 data[];
};

layout(buffer_reference, buffer_reference_align=2, scalar) buffer uint16_array{
    uint16_t data[];
};
layout(buffer_reference, buffer_reference_align=1, scalar) buffer u16vec2_array{
    u16vec2 data[];
};
layout(buffer_reference, buffer_reference_align=1, scalar) buffer u16vec3_array{
    u16vec3 data[];
};
layout(buffer_reference, buffer_reference_align=1, scalar) buffer u16vec4_array{
    u16vec4 data[];
};

layout(buffer_reference, buffer_reference_align=4, scalar) buffer uint32_array{
    uint32_t data[];
};
layout(buffer_reference, buffer_reference_align=1, scalar) buffer u32vec2_array{
    u32vec2 data[];
};
layout(buffer_reference, buffer_reference_align=1, scalar) buffer u32vec3_array{
    u32vec3 data[];
};
layout(buffer_reference, buffer_reference_align=1, scalar) buffer u32vec4_array{
    u32vec4 data[];
};

layout(buffer_reference, buffer_reference_align=8, scalar) buffer uint64_array{
    uint64_t data[];
};
layout(buffer_reference, buffer_reference_align=1, scalar) buffer u64vec2_array{
    u64vec2 data[];
};
layout(buffer_reference, buffer_reference_align=1, scalar) buffer u64vec3_array{
    u64vec3 data[];
};
layout(buffer_reference, buffer_reference_align=1, scalar) buffer u64vec4_array{
    u64vec4 data[];
};

layout(buffer_reference, buffer_reference_align=1, scalar) buffer int8_array{
    int8_t data[];
};
layout(buffer_reference, buffer_reference_align=1, scalar) buffer i8vec2_array{
    i8vec2 data[];
};
layout(buffer_reference, buffer_reference_align=1, scalar) buffer i8vec3_array{
    i8vec3 data[];
};
layout(buffer_reference, buffer_reference_align=1, scalar) buffer i8vec4_array{
    i8vec4 data[];
};


layout(buffer_reference, buffer_reference_align=2, scalar) buffer int16_array{
    int16_t data[];
};
layout(buffer_reference, buffer_reference_align=1, scalar) buffer i16vec2_array{
    i16vec2 data[];
};
layout(buffer_reference, buffer_reference_align=1, scalar) buffer i16vec3_array{
    i16vec3 data[];
};
layout(buffer_reference, buffer_reference_align=1, scalar) buffer i16vec4_array{
    i16vec4 data[];
};

layout(buffer_reference, buffer_reference_align=4, scalar) buffer int32_array{
    int32_t data[];
};
layout(buffer_reference, buffer_reference_align=1, scalar) buffer i32vec2_array{
    i32vec2 data[];
};
layout(buffer_reference, buffer_reference_align=1, scalar) buffer i32vec3_array{
    i32vec3 data[];
};
layout(buffer_reference, buffer_reference_align=1, scalar) buffer i32vec4_array{
    i32vec4 data[];
};

layout(buffer_reference, buffer_reference_align=8, scalar) buffer int64_array{
    int64_t data[];
};
layout(buffer_reference, buffer_reference_align=1, scalar) buffer i64vec2_array{
    i64vec2 data[];
};
layout(buffer_reference, buffer_reference_align=1, scalar) buffer i64vec3_array{
    i64vec3 data[];
};
layout(buffer_reference, buffer_reference_align=1, scalar) buffer i64vec4_array{
    i64vec4 data[];
};


#endif //BASICREFTYPES_GLSL