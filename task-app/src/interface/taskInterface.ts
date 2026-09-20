export default interface ITask {
    id?: number
    title?: string
    description?:string
    status?:string
    dateCreated?: Date
    dateCompleted?: Date
}