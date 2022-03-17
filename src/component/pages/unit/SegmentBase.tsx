import React,{ReactNode, useState} from 'react'
import { ImageView } from '../../uiparts/ImageView'
import styled from 'styled-components'

type Props = {
    image:ImageData|undefined,
    name:string,
    children?:ReactNode
}

export type SegmentProc = (input:ImageData,module?:typeof import("/workspace/pkg"),...options:any[])=>ImageData

export interface Segment {id:number,component:React.VFC<SegmentIF>,method:SegmentProc|null,options:any[]}

export interface SegmentIF {
    input?:ImageData|undefined,
    output?:(image:ImageData)=>void,
    update?:number
}

const TitleStyle = styled.p`
    padding-left:0.5rem;
    border-left:5px solid #42b0bd;
`

const CardStyle = styled.li`
    float: left;
    position: relative;
    border-radius:8px;
    box-shadow:0 4px 15px rgba(0,0,0,.2);
    min-width:250px;
    min-height:300px;
    background-color:white;
    :not(:first-child) {
        margin-left: 50px;
    }
    :not(:first-child)::before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: -30px;
        margin: auto;
        box-sizing: border-box;
        width: 15px;
        height: 15px;
        border: 15px solid transparent;
        border-left: 15px solid #2a75bf;
    }
`

const PrevStyle = styled.div`
    margin:25px;
    height:200px;
`

export const SegmentBase:React.VFC<Props> = ({image,name,children}) =>{
    return (
        <CardStyle>
            <TitleStyle>{name}</TitleStyle>
            <PrevStyle>
                <ImageView image={image} width='200' height='200'></ImageView>
            </PrevStyle>
            {children}
        </CardStyle>
    )
}