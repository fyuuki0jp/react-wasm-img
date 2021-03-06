import { SegmentBase } from "./SegmentBase";
import {SegmentIF} from "../../utils/types"
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import {FileOpenButton} from '../../uiparts/AtomDesign'


export const Component:React.VFC<SegmentIF> = ({del,input,update})=>{

    return (
        <SegmentBase name={'グレースケール'} image={input} del={del}>
        </SegmentBase>
    )
}