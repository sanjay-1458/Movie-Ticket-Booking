const dateFormat=(date:string)=>{

    return new Date(date).toLocaleString('en-US',{
        weekday:"short",
        month:"short",
        day:"numeric",
        hour:"numeric",
        minute:"numeric"
    })
}
export default dateFormat;