const AWS = require('aws-sdk')
const s3 = new AWS.S3()

async function timeWait(i) {
    return s3.putObject({
        Bucket: 'test-wait-api',
        Key: `test-${i}`,
        Body: Buffer.from(`Hello -- ${i}`),
    }).promise().then(async data => {
        const now = new Date()
        return s3.waitFor('objectExists', {
            Bucket: 'test-wait-api',
            Key: `test-${i}`,
        }).promise().then(() => {
            const then = new Date()
            return then - now
        })
    })
}

function printResult(deltas) {
    const sum = deltas.reduce((sum, curr) => { return sum + curr })
    const avg = sum / deltas.length
    const min = Math.min(...deltas)
    const max = Math.max(...deltas)
    console.log(`Statistics after ${deltas.length} uploads`)
    console.log(`Average:\t${avg}ms`)
    console.log(`Minimum:\t${min}ms`)
    console.log(`Maximum:\t${max}ms`)
}

async function main() {
    let deltas = []
    for (let i = 0; i < 500; i++) {
        p = await timeWait(i)
        deltas.push(p)
    }

    printResult(deltas)
}

main()
