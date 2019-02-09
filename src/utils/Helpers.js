
export const GenerateGuid = () => {
  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

export const ConvertToEpoch = (dateString) => {
  const splittedDate = dateString.split('-');
  return new Date(parseInt(splittedDate[0]), parseInt(splittedDate[1]) - 1, parseInt(splittedDate[2])).getTime() / 1000;
}