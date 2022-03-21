import React, { useEffect,useState,useRef } from 'react'

type Props = {
    image:ImageData|undefined,
    width:string,
    height:string
}

export const ImageView:React.FC<Props> = ({image,width,height}) => {
    const hiddenCanvas = useRef<HTMLCanvasElement>(null)
    const viewCanvas = useRef<HTMLCanvasElement>(null)
    const getContext = (element:HTMLCanvasElement): CanvasRenderingContext2D => {
        const canvas: any = element;
        return canvas.getContext('2d');
    };
    useEffect(() => {
        if(hiddenCanvas.current === null || image===undefined || viewCanvas.current === null)
            return
        const ctx = getContext(hiddenCanvas.current)
        const dst = getContext(viewCanvas.current)
        hiddenCanvas.current.width=image.width
        hiddenCanvas.current.height=image.height
        ctx.clearRect(0,0,parseInt(width),parseInt(height))
        ctx.putImageData(image,0,0)
        const aspect = image.height / image.width
        dst.drawImage(hiddenCanvas.current,0,0,image.width,image.height,0,0,parseInt(width),parseInt(height)*aspect)
    })
    return (
        <>
            <canvas ref={viewCanvas} width={width} height={height} ></canvas>
            <canvas ref={hiddenCanvas} style={{'display':'none'}} ></canvas>
        </>
    )
}