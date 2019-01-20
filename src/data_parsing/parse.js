export const parseDataSeries = (rawData, property) => {
  return rawData.map(data => {
    return [new Date(data.start_date).getTime(), data[property]]
  })
}