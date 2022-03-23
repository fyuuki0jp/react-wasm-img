import { SegmentBase } from "./SegmentBase";
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import {FileOpenButton} from '../../uiparts/AtomDesign'
import styled from "styled-components";
import {SegmentIF} from "../../utils/types"


const FilterInput = styled.input`
    width:60px;
`

export const Component:React.VFC<SegmentIF> = ({input,config,options=[1,1,1,1,1,1,1,1,1,0]})=>{
    const filters = [
        useRef<HTMLInputElement>(null),useRef<HTMLInputElement>(null),useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),useRef<HTMLInputElement>(null),useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),useRef<HTMLInputElement>(null),useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null)
    ]
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
            フィルタカーネル<br/>
            <table>
                <tbody>
                    <tr>
                        <td><FilterInput type='number' ref={filters[0]} defaultValue={options[0]}/></td>
                        <td><FilterInput type='number' ref={filters[1]} defaultValue={options[1]}/></td>
                        <td><FilterInput type='number' ref={filters[2]} defaultValue={options[2]}/></td>
                    </tr>
                    <tr>
                        <td><FilterInput type='number' ref={filters[3]} defaultValue={options[3]}/></td>
                        <td><FilterInput type='number' ref={filters[4]} defaultValue={options[4]}/></td>
                        <td><FilterInput type='number' ref={filters[5]} defaultValue={options[5]}/></td>
                    </tr>
                    <tr>
                        <td><FilterInput type='number' ref={filters[6]} defaultValue={options[6]}/></td>
                        <td><FilterInput type='number' ref={filters[7]} defaultValue={options[7]}/></td>
                        <td><FilterInput type='number' ref={filters[8]} defaultValue={options[8]}/></td>
                    </tr>
                </tbody>
            </table>
            フィルタオフセット：<FilterInput type='number' ref={filters[9]} defaultValue={options[9]}/>
            <button onClick={UpdateFilter}>フィルター更新</button>
        </SegmentBase>
    )
}