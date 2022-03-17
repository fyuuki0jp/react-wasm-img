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
    const [steps,setStep] = useState<Segment[]>([])
    const [images,setImage] = useState<ImageData[]>([])
    const [update,setUpdate] = useState<number>(0)
    const renders:JSX.Element[] = []
    const memory = wasm_bg.memory

    const SetInputComponent:(component:string)=>void = (component)=>{
        const nowStep=steps
        if(steps.length == 0)
        {
            const newID = 0
            switch (component) {
                case 'camera':
                    nowStep.push({id:newID,component:CameraInput.Component,method:null,options:[]})
                    break;
                case 'image':
                    nowStep.push({id:newID,component:ImageInput.Component,method:null,options:[]});
                    break;
                default:
                    break;
            }
            setImage([...images,new ImageData(100,100)])
            setUpdate(update+1)
            setStep(nowStep)
        }
        else{
            switch (component) {
                case 'camera':
                    nowStep[0] = {id:0,component:CameraInput.Component,method:null,options:[]}
                    break;
                case 'image':
                    nowStep[0] = {id:0,component:ImageInput.Component,method:null,options:[]}
                    break;
            
                default:
                    break;
            }
            setUpdate(update+1)
            setStep(nowStep)
        }
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
        setUpdate(update+1)
        setStep(nowStep)
        UpdateImage(0,images[0])
    }
    const UpdateImage:(index:number,image:ImageData)=>void = async (index,image)=>{
        let img = images
        img[index] = image
        for (let idx = index+1; idx < steps.length; idx++) {
            const element = steps[idx];
            if(element.method===null)
                break;
            img[idx] = await element.method(img[idx-1],wasm)
        }
        setImage([...img])
    }

        if(steps.length > 0){
            let prev:Segment|undefined = undefined
            const input = steps[0]
            renders.push(<input.component output={UpdateImage.bind(null,0)}/>)
            prev = input
            for (let index = 1; index < steps.length; index++) {
                const element = steps[index];
                renders.push(<element.component output={UpdateImage.bind(null,index)} input={images[index]}/>)
                prev = element
            }
        }

    return (
        <div>
            <h2>画像処理パイプライン作成</h2>
            <PipeLine>
                {renders}
            </PipeLine>
            <button onClick={()=>{SetInputComponent('image')}}>画像入力</button>
            <button onClick={()=>{SetInputComponent('camera')}}>カメラ入力</button>
            <button onClick={()=>{AddComponent('grayscale')}}>グレースケール変換</button>
        </div>
    )
}