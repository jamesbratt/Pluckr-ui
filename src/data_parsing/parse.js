export const parseDataSeries = (rawData, property) => {
  const dataSortedByDate = rawData.sort((a,b) => {
    return new Date(b.start_date) - new Date(a.start_date);
  });

  return dataSortedByDate.map(data => {
    return [new Date(data.start_date).getTime(), data[property]]
  })
}