
import {SegmentWorkerRequest,SegmentWorkerResponse} from '../component/utils/types'
//@ts-ignore
import {gray_scale,filter3x3_image} from '/workspace/wasm_component/pkg'

const GrayScale:(input:ImageData)=>ImageData = (input)=>{
    const out = new ImageData(input.width,input.height)
    const result = gray_scale(input.width,input.height,new Uint8Array(input.data))
    out.data.set(result)
    return out
}

const Filter3x3:(input:ImageData,options:number[])=>ImageData = (input,options)=>{
    const out = new ImageData(input.width,input.height)
    out.data.set(filter3x3_image(input.width,input.height,new Uint8Array(input.data),new Int8Array(options)))
    return out
}

onmessage = async (event) => {
    let data:SegmentWorkerRequest = event.data
    let img = data.image
    for (let idx = 1; idx < event.data.steps.length; idx++) {
        const element = data.steps[idx];
        switch(element.name){
            case 'grayscale':
                img = GrayScale(img)
                break;
            case '3x3filter':
                img = Filter3x3(img,element.options)
        }
        let response = {index:idx,image:img}
        postMessage(response)
    }
}
