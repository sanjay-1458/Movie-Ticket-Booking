export const timeFormat = (minutes)=>{
    const hours=Math.floor(minutes/60) ;
    const minutesR=(minutes%60).toFixed(0);
    return `${hours}h ${minutesR}m`;
}