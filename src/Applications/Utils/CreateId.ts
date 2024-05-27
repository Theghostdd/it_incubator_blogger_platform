

export async function CreateId () {
    const createID = new Date ()
    const getDate = createID.getDate()
    const getMonth =  createID.getMonth() + 1
    const getYear = createID.getFullYear()
    const getTime = createID.getTime()
    
    const random = Math.floor(Math.random() * 9999)

    const result = `${getDate}${getMonth}${getYear}${getTime}${random}`.toString()
    return result

}