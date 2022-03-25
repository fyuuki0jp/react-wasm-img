import React,{Component, useEffect, useState,useRef} from 'react'
import * as ImageInput from './unit/ImageInput'
import * as CameraInput from './unit/CameraInput'
import * as GrayScale from './unit/GrayScaleImage'
import * as Filter3x3 from './unit/FilterImage3x3'
import styled from 'styled-components'
import { Segment, SegmentWorkerResponse} from '../utils/types'


const PipeLine = styled.ul`
    margin-top:1%;
    width:450px;
    border-radius:10px;
    min-height:400px;
    overflow-x: scroll;
    background-color:#ccc;
    list-style: none;
    padding:25px;
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

const worker = new Worker(new URL('/workspace/src/Workers/pipeline.worker.ts',import.meta.url))

export const CreatePipeLine:React.FC = () => {
    const [steps,setStep] = useState<Segment[]>([])
    const [images,setImage] = useState<ImageData[]>([])
    const [update,setUpdate] = useState<number>(0)
    const [proc,setProc] = useState<number>(0)
    const renders:JSX.Element[] = []
    const SetInputComponent:(component:string)=>void = (component)=>{
        const nowStep=steps
        if(steps.length == 0 || (steps[0].name!='camera' && steps[0].name!='image'))
        {
            const newID = 0
            switch (component) {
                case 'camera':
                    nowStep.unshift({name:'camera',id:newID,options:[]})
                    break;
                case 'image':
                    nowStep.unshift({name:'image',id:newID,options:[]});
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
                    nowStep[0] = {name:'camera',id:0,options:[]}
                    break;
                case 'image':
                    nowStep[0] = {name:'image',id:0,options:[]}
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
                nowStep.push({name:'grayscale',id:newID,options:[]})
                break;
            case '3x3filter':
                nowStep.push({name:'3x3filter',id:newID,options:[-1,-1,-1,-1,8,-1,-1,-1,-1,0]})
                break;
                    default:
                break;
        }
        setUpdate(update+1)
        setStep(nowStep)
        UpdateImage(0,images[0])
    }

    const UpdateImage:(index:number,image:ImageData)=>void = async (index,image)=>{
        worker.onmessage = (ev:MessageEvent<SegmentWorkerResponse>) =>{
            const copy_images = images.slice()
            copy_images[ev.data.index] = ev.data.image
            setImage(copy_images)
        }
        worker?.postMessage({image:image,steps:steps})
    }

    const DeleteComponent:(index)=>void = (index)=>{
        const nowStep = steps;
        nowStep.splice(index,1)
        setStep([...nowStep])
    }

    const UpdateOptions:(index:number,options:any[])=> void = async (index,options)=>{
        const nowSteps = steps
        nowSteps[index].options = options
        setStep(nowSteps)
    }
    useEffect(()=>{
    },[])

    if(steps.length > 0){
        const input = steps[0]
        for (let index = 0; index < steps.length; index++) {
            const element = steps[index];
            switch(element.name)
            {
                case 'camera':
                    renders.push(<CameraInput.Component output={UpdateImage.bind(null,0)} del={DeleteComponent.bind(null,0)}/>)
                    break;
                case 'image':
                    renders.push(<ImageInput.Component output={UpdateImage.bind(null,0)} del={DeleteComponent.bind(null,0)}/>)
                    break;
                case 'grayscale':
                    renders.push(<GrayScale.Component  config={UpdateOptions.bind(null,index)} input={images[index]} options={element.options} del={DeleteComponent.bind(null,index)}/>)
                    break;
                case '3x3filter':
                    renders.push(<Filter3x3.Component  config={UpdateOptions.bind(null,index)} input={images[index]} options={element.options} del={DeleteComponent.bind(null,index)}/>)
                    break;
                }
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