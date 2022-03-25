import React,{ReactNode, useState} from 'react'
import { ImageView } from '../../uiparts/ImageView'
import styled from 'styled-components'

type Props = {
    image:ImageData|undefined,
    name:string,
    del:()=>void
    children?:ReactNode
}

const TitleStyle = styled.span`
    padding-left:0.5rem;
    border-left:5px solid #42b0bd;
    line-height:30px;
    color: #42b0bd;
`

const CardStyle = styled.li`
    float: flex;
    position: relative;
    border-radius:8px;
    box-shadow:0 4px 15px rgba(0,0,0,.2);
    min-width:250px;
    min-height:300px;
    padding: 0.5rem;
    background-color:white;
    :not(:first-child) {
        margin-top: 50px;
    }
    :not(:first-child)::before {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        top: -30px;
        margin: auto;
        box-sizing: border-box;
        width: 15px;
        height: 15px;
        border: 15px solid transparent;
        border-left: 15px solid #2a75bf;
        transform: rotate(90deg);
    }
`

const PrevStyle = styled.div`
    width:250px;
`

const OptionStyle = styled.div`
    width: 250px;
`

const ViewStyle = styled.div`
    display:flex;
`

const CloseStyle = styled.span`
    display: inline-block;
    position: relative;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    float:right;
    background: #FCC;
    &:hover {
        background: #F33;
    }
    &:after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 3px; /* 棒の幅（太さ） */
        height: 22px; /* 棒の高さ */
        background: #FFF; /* バツ印の色 */
        transform: translate(-50%,-50%) rotate(-45deg);
    }
    &:before {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 3px; /* 棒の幅（太さ） */
        height: 22px; /* 棒の高さ */
        background: #FFF; /* バツ印の色 */
        transform: translate(-50%,-50%) rotate(45deg);
    }
`



export const SegmentBase:React.VFC<Props> = ({image,del,name,children}) =>{
    const [open,setOpen] = useState(true);

    return (
        <CardStyle>
            <TitleStyle>{name}</TitleStyle>
            <CloseStyle onClick={del}/>
            <ViewStyle>
                <PrevStyle>
                    <ImageView image={image} width='200' height='200'></ImageView>
                </PrevStyle>
                <OptionStyle>
                    {open ? children:''}
                </OptionStyle>
            </ViewStyle>
        </CardStyle>
    )
}