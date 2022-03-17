import { SegmentBase,SegmentIF,SegmentProc } from "./SegmentBase";
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import {FileOpenButton} from '../../uiparts/AtomDesign'

export const Process:SegmentProc = (input,module,options)=>{
    if (module===undefined || input === undefined)
        return input
    let process:(width: number, height: number, raw_data: Uint8Array)=> Uint8Array=module.gray_scale
    const out = new ImageData(input.width,input.height)
    out.data.set(process(input.width,input.height,new Uint8Array(input.data)))
    return out
}

export const Component:React.VFC<SegmentIF> = ({input,update})=>{

    return (
        <SegmentBase name={'グレースケール'} image={input}>
        </SegmentBase>
    )
}