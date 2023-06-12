import { findSchemaBySubjectAndVersion, sendMessageToTopic, readMessageFromTopic } from './index.js'

const topic = 'stock_update'
const version = 1
const subject = 'stock_update-value'

const writeStockDataToKafka = async (payload) => {
  try {
    const encodePayloadId = await findSchemaBySubjectAndVersion({ version, subject })

    console.log(`Topic: ${topic}; subject: ${subject}; id: ${encodePayloadId}`)

    await sendMessageToTopic({ payload, topic, encodePayloadId })

  } catch (err) {
    console.error(err)
  }
}

const readMessages = () => {
  readMessageFromTopic(topic, (data) => {
    console.log(data, 'data desde kafka')
  })
}

export {
    writeStockDataToKafka,
    readMessages
}
