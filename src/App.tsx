import React from 'react';
import {CreatePipeLine} from './component/pages/CreatePipeLine'

export const App:React.VFC = ()=>{
    return (
        <React.StrictMode>
            <h1>Hello World</h1>
            <CreatePipeLine/>
        </React.StrictMode>
    )
}