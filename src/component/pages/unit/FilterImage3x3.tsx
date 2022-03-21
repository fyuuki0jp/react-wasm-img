import { SegmentBase } from "./SegmentBase";
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import {FileOpenButton} from '../../uiparts/AtomDesign'
import styled from "styled-components";
import {SegmentIF} from "../../utils/types"


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