function formatTime(t){
    const range = t[t.length-1].toLowerCase();
    const value = range == 'e' ? 1 : Number(t.match(/\d+/)[0]);

    const now = new Date();
    const end = now;
    switch (range){
        case "e":{
            end.setTime(0)
            return {
                start: end.toISOString(),
                groupBy: "day"
            }
            break;
        }
        case "h":{
            end.setTime(now.getTime()-((60*60*1000) * value))
            return {
                start: end.toISOString(),
                groupBy: "hour"
            }
            break;
        }
        case "d":{
            end.setTime(now.getTime()-((24*60*60*1000) * value))
            return {
                start: end.toISOString(),
                groupBy: "day"
            }
            break;
        }
        case "o":{
            end.setTime(now.getTime()-((30*24*60*60*1000) * value))
            return {
                start: end.toISOString(),
                groupBy: "day"
            }
            break;
        }
        case "y":{
            end.setTime(now.getTime()-((12*30*24*60*60*1000) * value))
            return {
                start: end.toISOString(),
                groupBy: "day"
            }
            break;
        }
        // default: {
        //     console.log(value)
        //     console.log(range)
        // }
    }
}
const validTimes = [
    // '6H',
    // '12H',
    '1D',
    '3D',
    '7D',
    '1MO',
    '3MO',
    '6MO',
    '9MO',
    '1Y',
    '3Y',
    '5Y',
    'All Time' 
].map(a=>a.toLowerCase())
function validateTimes(t) {
    return validTimes.includes(t.toLowerCase())
}

export default defineEventHandler((event) => {
    event.context.formatTime = formatTime
    event.context.validateTimes = validateTimes
})