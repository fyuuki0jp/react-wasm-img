import React, { Children } from 'react'
import styled from 'styled-components'

interface FileOpen {
    update:(e:React.ChangeEvent<HTMLInputElement>)=>void,
    children?:React.ReactNode
};

const Button = styled.div`
    border: 2px solid #42b0bd;
    border-radius:2px;
    margin:1rem;
    color: #42b0bd;
    background-color:white;
    text-align: center;
    transition: 0.4s ;
    &:hover {
        background-color: #42b0bd;
        color:white;
    }
`

export const FileOpenButton:React.VFC<FileOpen> = ({update,children}) =>{
    return (
        <label>
            <Button>{children ? children : 'ファイルを開く'}</Button>
            <input type='file' onChange={update} style={{'display':'none'}}></input>
        </label>
    )
}