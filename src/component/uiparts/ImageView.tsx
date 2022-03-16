import React, { useEffect,useState,useRef } from 'react'

type Props = {
    image:ImageData|undefined,
    width:string,
    height:string
}

export const ImageView:React.FC<Props> = ({image,width,height}) => {
    const imageElement = useRef<HTMLImageElement>(null)
    const hiddenCanvas = useRef<HTMLCanvasElement>(null)
    const getContext = (element:HTMLCanvasElement): CanvasRenderingContext2D => {
        const canvas: any = element;
        return canvas.getContext('2d');
    };
    useEffect(() => {
        if(imageElement.current===null || hiddenCanvas.current === null || image===undefined)
            return
        const ctx = getContext(hiddenCanvas.current)
        hiddenCanvas.current.width=image.width
        hiddenCanvas.current.height=image.height
        ctx.clearRect(0,0,hiddenCanvas.current.width,hiddenCanvas.current.height)
        ctx.putImageData(image,0,0)
        imageElement.current.src = hiddenCanvas.current.toDataURL()
    })
    return (
        <>
            <img ref={imageElement} width={width}></img>
            <canvas ref={hiddenCanvas} style={{'display':'none'}}></canvas>
        </>
    )
}