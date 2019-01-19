export const parseDataSeries = (rawData, property) => {
  return rawData.map(data => {
    return [data.start_date, data[property]]
  })
}