import { SegmentBase,SegmentIF,SegmentProc } from "./SegmentBase";
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import {FileOpenButton} from '../../uiparts/AtomDesign'
import styled from "styled-components";

export const Process:SegmentProc = (input,module,options)=>{
    if (module===undefined || input === undefined)
        return input
    let process:(width: number, height: number, raw_data: Uint8Array,filter_data:Int8Array)=> Uint8Array=module.filter3x3_image
    const out = new ImageData(input.width,input.height)
    out.data.set(process(input.width,input.height,new Uint8Array(input.data),new Int8Array(options)))
    return out
}

const FilterInput = styled.input`
    width:60px;
`

export const Component:React.VFC<SegmentIF> = ({input,config,options=[1,1,1,1,1,1,1,1,1]})=>{
    const filters = [
        useRef<HTMLInputElement>(null),useRef<HTMLInputElement>(null),useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),useRef<HTMLInputElement>(null),useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),useRef<HTMLInputElement>(null),useRef<HTMLInputElement>(null)
    ]

    const table = []


    for(let i=0;i<3;i++)
    {
        const row = []
        for(let j=0;j<3;j++)
        {
            row.push(<td><FilterInput type='number' ref={filters[i*3+j]} defaultValue={options[i*3+j]}/></td>)
        }
        table.push(<tr>
            {row}
        </tr>)
    }
    const UpdateFilter = ()=>{
        const option:number[] = []
        filters.forEach((ref)=>{
            if(ref.current === null)
                option.push(1)
            option.push(parseInt(ref.current?.value===undefined ? '1':ref.current?.value))
        })
        if(config)
            config(option)
    }
    return (
        <SegmentBase name={'3x3フィルター'} image={input}>
            <table>
                <tbody>
                    {table}
                </tbody>
            </table>
            <button onClick={UpdateFilter}>フィルター更新</button>
        </SegmentBase>
    )
}