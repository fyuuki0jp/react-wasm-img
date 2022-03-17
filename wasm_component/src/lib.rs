use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn gray_scale(width: u32, height: u32, raw_data: Vec<u8>) -> Vec<u8> {
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
