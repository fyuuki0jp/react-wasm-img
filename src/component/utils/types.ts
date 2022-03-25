

export type SegmentProc = (input:ImageData,module?:typeof import("/workspace/wasm_component/pkg"),...options:any[])=>ImageData

export interface Segment {name:string,id:number,options:any[]}

export interface SegmentIF {
    input?:ImageData|undefined,
    output?:(image:ImageData)=>void,
    config?:(options:any[])=>void,
    options?:any[],
    del:()=>void,
    update?:number
}

export interface SegmentWorkerRequest {
    image:ImageData,
    steps:Segment[],
}

export interface SegmentWorkerResponse {
    image:ImageData,
    index:number
s}