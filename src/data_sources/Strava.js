const stravaDataModel = [
  {
    source: 'activities',
    filters: [
      'before',
      'after'
    ]
  }
];

export const StravaSetModelData = () => {
  // Set model into store
  return stravaDataModel; 
}