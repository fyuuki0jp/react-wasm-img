
import {SegmentWorkerRequest,SegmentWorkerResponse} from '../component/utils/types'



/* eslint-disable @typescript-eslint/no-explicit-any */
const ctx: Worker = self as any
let gray_scale = (width: number, height: number, raw_data: Uint8Array)=> {return raw_data};
let filter3x3_image = (width: number, height: number, raw_data: Uint8Array,filter_data:Int8Array)=> {return raw_data};

import('/workspace/wasm_component/pkg').then(obj=>{
    gray_scale = obj.gray_scale
    filter3x3_image = obj.filter3x3_image
    console.log('load complete.')
})

const GrayScale = (input:ImageData)=>{
    const out = new ImageData(input.width,input.height)
    out.data.set(gray_scale(input.width,input.height,new Uint8Array(input.data)))
    return out
}

const Filter3x3 = (input:ImageData,options:any[])=>{
    const out = new ImageData(input.width,input.height)
    out.data.set(filter3x3_image(input.width,input.height,new Uint8Array(input.data),new Int8Array(options)))
    return out
}


ctx.onmessage = async (event:MessageEvent<SegmentWorkerRequest>) => {
    console.log('recv event')
    let img = event.data.images
    img[0] = event.data.image
    for (let idx = 1; idx < event.data.steps.length; idx++) {
        const element = event.data.steps[idx];
        switch(element.name){
            case 'grayscale':
                img[idx] = GrayScale(img[idx-1])
                break;
            case '3x3filter':
                img[idx] = Filter3x3(img[idx-1],element.options)
        }
    }
    let response = {images:img}
    ctx.postMessage(response)
}

export default ctx