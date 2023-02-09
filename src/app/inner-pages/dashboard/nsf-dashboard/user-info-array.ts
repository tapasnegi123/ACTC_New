export const DO:Do = [
    {
        imgSrc:"/assets/images/dashboard/verified-quick.svg",
        link:"",
        title:"FEDERATION DETAILS"
    },
    {
        imgSrc:"/assets/images/dashboard/meeting-quick.svg",
        link:"",
        title:"MINUTES OF MEETING"
    },
    {
        imgSrc:"/assets/images/dashboard/released-quick.svg",
        link:"",
        title:"RELEASED SANCTIONS"
    },
    {
        imgSrc:"/assets/images/dashboard/new-quick.svg",
        link:"manage-actc/list",
        title:"MANAGE ACTC"
    },
    {
        imgSrc:"/assets/images/dashboard/enable-actc-submission.svg",
        link:"EAS",
        title:"ENABLE ACTC SUBMISSION"
    },
]

type Do = IDO[]

export interface IDO{
    imgSrc:string,
    title:string,
    link:string
}