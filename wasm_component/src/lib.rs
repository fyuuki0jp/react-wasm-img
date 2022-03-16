use wasm_bindgen::prelude::*;

fn zeros(size: usize) -> Vec<u8> {
    let mut zero_vec: Vec<u8> = Vec::with_capacity(size as usize);
    for i in 0..size {
        zero_vec.push(0);
    }
    return zero_vec;
}

#[wasm_bindgen]
pub fn createImageBuffer(width: u32, height: u32,channels:u32) -> *const u8 {
    let size = (width*height*channels) as usize;
    return zeros(size).as_ptr();
}

#[wasm_bindgen]
pub fn grayscale(width: u32, height: u32, raw_data: Vec<u8>) -> Vec<u8> {
    let mut out : Vec<u8> = raw_data.clone();
    for y in 0..height {
        let addr = y*(width*4);
        for x in 0..width {
            let offset = (addr+x*4) as usize;
            let gray = (0.2126 * raw_data[offset] as f32 + 0.7152 * raw_data[offset+1] as f32 + 0.0722 * raw_data[offset+2] as f32) as u8;
            out[offset] = gray;
            out[offset+1] = gray;
            out[offset+2] = gray;
        }
    }
    return out;
}
