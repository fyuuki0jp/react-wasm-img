import { SegmentBase,SegmentIF } from "./SegmentBase";
import React, { memo, useEffect, useMemo, useRef, useState } from 'react'
import * as wasm from '/workspace/wasm_component/pkg'
import * as wasm_bg from '/workspace/wasm_component/pkg/index_bg.wasm'

export const Component:React.VFC<SegmentIF> = ({output})=>{
    const hiddenVideo = useRef<HTMLVideoElement>(null)
    const hiddenCanvas = useRef<HTMLCanvasElement>(null)
    const [image,setImage] = useState<ImageData|undefined>(undefined)
    const [width,setWidth] = useState(640)
    const [height,setHeight] = useState(480)
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
            hiddenVideo.current.play()
            _canvasUpdate();

            function _canvasUpdate() {
                requestAnimationFrame(_canvasUpdate);
                if(hiddenCanvas.current===null || hiddenVideo.current===null) 
                    return;
                const back = getContext(hiddenCanvas.current)
                back.drawImage(hiddenVideo.current, 0, 0, hiddenCanvas.current.width, hiddenCanvas.current.height);
                const buffer = back.getImageData(0,0,hiddenCanvas.current.width,hiddenCanvas.current.height)
                setImage(buffer)
                if(output!==undefined)
                    output(buffer)
            };
        });
    }

    const UnInit = ()=>{
        if(hiddenVideo.current===null || stream===null)
        {
            setTimeout(UnInit,100)
            return;
        }
        hiddenVideo.current.pause()
        stream.getTracks().forEach(track => track.stop())
    }

    useEffect(()=>{
        Init()
        return UnInit
    },[])

    return (
        <SegmentBase name={'カメラ入力'} image={image}>
            <canvas ref={hiddenCanvas} style={{'display':'none'}}></canvas>
            <video ref={hiddenVideo} style={{'display':'none'}}></video>
            <button>{'カメラスタート'}</button>
        </SegmentBase>
    )
}