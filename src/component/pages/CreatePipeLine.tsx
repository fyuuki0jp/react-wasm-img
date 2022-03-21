import React,{Component, useEffect, useState} from 'react'
import * as ImageInput from './unit/ImageInput'
import * as CameraInput from './unit/CameraInput'
import * as GrayScale from './unit/GrayScaleImage'
import * as Filter3x3 from './unit/FilterImage3x3'
import styled from 'styled-components'
import * as wasm from '/workspace/wasm_component/pkg'
import { SegmentIF,Segment,SegmentProc } from './unit/SegmentBase'

const PipeLine = styled.ul`
    margin-top:1%;
    width:100%;
    border-radius:10px;
    min-height:400px;
    overflow-x: scroll;
    background-color:#ccc;
    list-style: none;
    padding:10px;
`

const ItemList = styled.div`
    width:100%;
    height:20%;
`

const Item = styled.span`
    display:inline-block;
    width:150px;
    height:40px;
    margin-left:0.2rem;
    line-height:40px;
    text-align:center;
    color:white;
    background: -moz-linear-gradient(top, #34c9eb,#42b0bd); 
    background: -webkit-linear-gradient(top, #34c9eb,#42b0bd); 
    background: linear-gradient(to bottom, #34c9eb,#42b0bd);
    user-select: none; /* CSS3 */
    -moz-user-select: none; /* Firefox */
    -webkit-user-select: none; /* Safari、Chromeなど */
`


export const CreatePipeLine:React.FC = () => {
    const [steps,setStep] = useState<Segment[]>([])
    const [images,setImage] = useState<ImageData[]>([])
    const [update,setUpdate] = useState<number>(0)
    const renders:JSX.Element[] = []

    const SetInputComponent:(component:string)=>void = (component)=>{
        const nowStep=steps
        if(steps.length == 0)
        {
            const newID = 0
            switch (component) {
                case 'camera':
                    nowStep.push({name:'camera',id:newID,component:CameraInput.Component,method:null,options:[]})
                    break;
                case 'image':
                    nowStep.push({name:'image',id:newID,component:ImageInput.Component,method:null,options:[]});
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
                    nowStep[0] = {name:'camera',id:0,component:CameraInput.Component,method:null,options:[]}
                    break;
                case 'image':
                    nowStep[0] = {name:'image',id:0,component:ImageInput.Component,method:null,options:[]}
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
                nowStep.push({name:'grayscale',id:newID,component:GrayScale.Component,method:GrayScale.Process,options:[]})
                break;
            case '3x3filter':
                nowStep.push({name:'3x3filter',id:newID,component:Filter3x3.Component,method:Filter3x3.Process,options:[-1,-1,-1,-1,8,-1,-1,-1,-1]})
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
            img[idx] = element.method(img[idx-1],wasm,element.options)
        }
        setImage([...img])
    }
    const UpdateOptions:(index:number,options:any[])=> void = async (index,options)=>{
        const nowSteps = steps
        nowSteps[index].options = options
        setStep(nowSteps)
    }

        if(steps.length > 0){
            let prev:Segment|undefined = undefined
            const input = steps[0]
            renders.push(<input.component output={UpdateImage.bind(null,0)}/>)
            prev = input
            for (let index = 1; index < steps.length; index++) {
                const element = steps[index];
                renders.push(<element.component config={UpdateOptions.bind(null,index)} input={images[index]} options={element.options}/>)
                prev = element
            }
        }

    return (
        <div>
            <ItemList>
                <Item onClick={()=>{SetInputComponent('image')}}>画像入力</Item>
                <Item onClick={()=>{SetInputComponent('camera')}}>カメラ入力</Item>
                <Item onClick={()=>{AddComponent('grayscale')}}>グレースケール変換</Item>
                <Item onClick={()=>{AddComponent('3x3filter')}}>3x3フィルター</Item>
            </ItemList>
            <PipeLine>
                {renders}
            </PipeLine>
        </div>
    )
}