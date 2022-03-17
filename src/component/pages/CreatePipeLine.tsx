import React,{Component, useEffect, useState} from 'react'
import * as ImageInput from './unit/ImageInput'
import * as CameraInput from './unit/CameraInput'
import * as GrayScale from './unit/GrayScaleImage'
import styled from 'styled-components'
import * as wasm from '/workspace/wasm_component/pkg'
import * as wasm_bg from '/workspace/wasm_component/pkg/index_bg.wasm'
import { SegmentIF,Segment,SegmentProc } from './unit/SegmentBase'

const PipeLine = styled.ul`
    width:80%,
    min-height:300px;
    overflow-x: scroll;
    display: flex;
    background-color:#ccc;
    list-style: none;
    padding:10px;
`

export const CreatePipeLine:React.FC = () => {
    const [steps,setStep] = useState<Segment[]>([{id:0,component:CameraInput.Component,method:null,options:[]}])
    const [images,setImage] = useState<ImageData[]>([new ImageData(100,100)])
    const [update,setUpdate] = useState<number[]>([0])
    const renders:JSX.Element[] = []

    const UpdateImage:(index:number,image:ImageData)=>void = (index,image)=>{
        let img = images
        img[index] = image
        for (let idx = index+1; idx < steps.length; idx++) {
            const element = steps[idx];
            if(element.method===null)
                break;
            img[idx] = element.method(img[idx-1],wasm)
        }
        setImage([...img])
    }

    let prev:Segment|undefined = undefined
    const input = steps[0]
    renders.push(<input.component output={UpdateImage.bind(null,0)} update={0}/>)
    prev = input
    for (let index = 1; index < steps.length; index++) {
        const element = steps[index];
        renders.push(<element.component output={UpdateImage.bind(null,index)} input={images[index]} update={update[index]}/>)
        prev = element
    }

    const AddComponent:(component:string)=>void = (component)=>{
        const nowStep=steps
        const newID = nowStep[nowStep.length-1].id+1
        switch (component) {
            case 'grayscale':
                nowStep.push({id:newID,component:GrayScale.Component,method:GrayScale.Process,options:[]})
                break;
        
            default:
                break;
        }
        const memory = wasm_bg.memory
        const size = images[nowStep[nowStep.length-1].id].width*images[nowStep[nowStep.length-1].id].height*4;

        const outbuffer = new Uint8ClampedArray(memory.buffer,wasm.create_image_buffer(images[nowStep[nowStep.length-1].id].width,images[nowStep[nowStep.length-1].id].height,4),size)
        setImage([...images,new ImageData(outbuffer,images[nowStep[nowStep.length-1].id].width)])
        setUpdate([...update,0])
        setStep(nowStep)
    }
    return (
        <div>
            <h2>画像処理パイプライン作成</h2>
            <PipeLine>
                {renders}
            </PipeLine>
            <button onClick={()=>{AddComponent('grayscale')}}>グレースケール変換</button>
        </div>
    )
}