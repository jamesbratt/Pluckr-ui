const STRAVA_URI = 'https://www.strava.com/api/v3';

const STRAVA_RESOURCES = {
  activities: '/athlete/activities'
};

const getActivities = (perPage) => {
  const token = localStorage.getItem('token');
  return fetch(`${STRAVA_URI}${STRAVA_RESOURCES.activities}?per_page=${perPage}`, {
    headers:{
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }).then(response => {
    return response.json();
  }).then(response => {
    return response;
  })
};

export const getData = (resource, perPage) => {
  switch(resource) {
    case STRAVA_RESOURCES.activities:
    return getActivities(perPage);
  default:
    return getActivities(perPage);
  }
};