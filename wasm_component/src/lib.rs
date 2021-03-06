use wasm_bindgen::prelude::*;
use std::cmp;

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

#[wasm_bindgen]
pub fn filter3x3_image(input_color:u32,width:u32,height:u32,raw_data:Vec<u8>,filter_data:Vec<i8>) -> Vec<u8> {
    let mut out : Vec<u8> = raw_data.clone();
    let width_length = width*4;
    let addrs:[i32;3] = [width_length as i32 *-1,0,width_length as i32];
    let mut total:f32 = 0.0;
    let mut div:f32 = 1.0;
    for f in 0..9 {
        total += filter_data[f] as f32;
    }
    if total > 1.0 {
        div = total;
    }

    for y in 1..(height-1) {
        let addr = (y*width_length) as usize;
        for x in 1..(width-1) {
            let offset = (addr as u32 + x * 4) as usize;
            let mut r:f32 = 0.0;
            let mut g:f32 = 0.0;
            let mut b:f32 = 0.0;
            for j in 0..3 {
                let filter = j*3;
                for i in 0..3 {
                    let px = (offset as i32+addrs[j as usize]+i*4-4) as u32 as usize;
//                    log(&format!("addr {}", px));
                    r += raw_data[px] as f32* filter_data[(filter+i) as usize] as f32;
                    if input_color==0 {
                        g += raw_data[px+1] as f32* filter_data[(filter+i) as usize] as f32;
                        b += raw_data[px+2] as f32* filter_data[(filter+i) as usize] as f32;
                    }
                }
            }
            out[offset] = cmp::max(0,cmp::min(255,((r+ filter_data[9]as f32) / div) as u32)) as u8;
            if input_color==0 {
                out[offset+1] = cmp::max(0,cmp::min(255,((g+ filter_data[9]as f32) / div) as u32)) as u8;
                out[offset+2] = cmp::max(0,cmp::min(255,((b+ filter_data[9]as f32) / div) as u32)) as u8;
            }
            else
            {
                out[offset+1] = out[offset];
                out[offset+2] = out[offset];
            }

        }
    }
    return out;
}