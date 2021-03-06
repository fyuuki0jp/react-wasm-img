import { SegmentBase } from "./SegmentBase";
import {SegmentIF,SegmentProc} from "../../utils/types"
import React, { ChangeEvent, useRef, useState } from 'react'
import {FileOpenButton} from '../../uiparts/AtomDesign'

export const Component:React.VFC<SegmentIF> = ({del,output})=>{
    const hiddenCanvas = useRef<HTMLCanvasElement>(null)
    const [image,setImage] = useState<ImageData|undefined>(undefined)
    const getContext = (element:HTMLCanvasElement): CanvasRenderingContext2D => {
        const canvas: any = element;
        return canvas.getContext('2d');
    };
    const UpdatePath = (e:React.ChangeEvent<HTMLInputElement>)=>{
        if(e.target.files===null)
            return;

        const file = e.target.files[0]
        const dataURL = URL.createObjectURL(file)
        const img = new Image()
        img.onload = ()=>{
            if(hiddenCanvas.current === null)
                return
            const back = getContext(hiddenCanvas.current)
            hiddenCanvas.current.width=img.width
            hiddenCanvas.current.height=img.height
            back.clearRect(0,0,hiddenCanvas.current.width,hiddenCanvas.current.height)
            back.drawImage(img,0,0)
            const out = back.getImageData(0,0,hiddenCanvas.current.width,hiddenCanvas.current.height)
            setImage(out)
            if(output!==undefined)
               output(out)
        }
        img.src = dataURL
    }
    return (
        <SegmentBase name={'画像入力'} image={image} del={del}>
            <canvas ref={hiddenCanvas} style={{'display':'none'}}></canvas>
            <FileOpenButton update={UpdatePath}>入力画像を指定する</FileOpenButton>
        </SegmentBase>
    )
}