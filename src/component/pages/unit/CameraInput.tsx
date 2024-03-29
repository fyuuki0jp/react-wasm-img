import { SegmentBase } from "./SegmentBase";
import {SegmentIF,SegmentProc} from "../../utils/types"
import React, { memo, useEffect, useMemo, useRef, useState } from 'react'

export const Component:React.VFC<SegmentIF> = ({del,output})=>{
    const hiddenVideo = useRef<HTMLVideoElement>(null)
    const hiddenCanvas = useRef<HTMLCanvasElement>(null)
    const [image,setImage] = useState<ImageData|undefined>(undefined)
    const [width,setWidth] = useState(640)
    const [height,setHeight] = useState(480)
    const [play,setPlay] = useState(0)
    const ref = useRef(0)
    const [stream,setStrream] = useState<MediaStream|null>(null)
    const getContext = (element:HTMLCanvasElement): CanvasRenderingContext2D => {
        const canvas: any = element;
        return canvas.getContext('2d');
    };

    const Init = ()=>{
        navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                width: { ideal: width },
                height: { ideal: height }
            }
          }).then(function(stream) {
            if(hiddenCanvas.current===null || hiddenVideo.current===null){
                setTimeout(Init,100)
                return;
            }
            setStrream(stream)
            hiddenCanvas.current.width = width
            hiddenCanvas.current.height = height
            hiddenVideo.current.srcObject = stream;
            console.log('open camera')
            hiddenVideo.current?.play()
            setPlay(1)
        });
    }
    function _canvasUpdate() {
        if(hiddenCanvas.current===null || hiddenVideo.current===null) 
            return;
        const back = getContext(hiddenCanvas.current)
        back.drawImage(hiddenVideo.current, 0, 0, hiddenCanvas.current.width, hiddenCanvas.current.height);
        const buffer = back.getImageData(0,0,hiddenCanvas.current.width,hiddenCanvas.current.height)
        setImage(buffer)
        if(output!==undefined)
            output(buffer)
        if(play)
            setTimeout(_canvasUpdate,100)
    };
    const UnInit = ()=>{
        if(hiddenVideo.current===null || stream===null)
        {
            setTimeout(UnInit,100)
            return;
        }
        hiddenVideo.current.pause()
        stream.getTracks().forEach(track => track.stop())
    }

    const CameraControl=()=>{
        if(play)
        {
            hiddenVideo.current?.pause()
            setPlay(0)
            
//            cancelAnimationFrame(ref.current)
        }
        else
        {
            hiddenVideo.current?.play()
            setPlay(1)
            setTimeout(_canvasUpdate,100)
        }
    }

    useEffect(()=>{
        Init()
        return UnInit
    },[])

    useEffect(()=>{
        if(play==1)
        {
            _canvasUpdate();
        }
    },[play])

    return (
        <SegmentBase name={'カメラ入力'} image={image} del={del}>
            <canvas ref={hiddenCanvas} style={{'display':'none'}}></canvas>
            <video ref={hiddenVideo} style={{'display':'none'}}></video>
            <button onClick={CameraControl}>{play==0 ? '撮影開始':'撮影停止'}</button>
        </SegmentBase>
    )
}