const STRAVA_URI = 'https://www.strava.com/api/v3';

const STRAVA_RESOURCES = {
  activities: '/athlete/activities'
};

const RESOURCE_PROPERTIES = {
  activities: [
    'distance',
    'moving_time',
    'elapsed_time',
    'total_elevation_gain',
    'achievement_count',
    'kudos_count',
    'comment_count',
    'average_speed',
    'max_speed',
    'calories',
    'total_photo_count',
    'athlete_count',
    'average_watts',
    'max_watts',
  ]
}

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
    return {
      data: getActivities(perPage),
      properties: RESOURCE_PROPERTIES.activities,
    };
  default:
    return getActivities(perPage);
  }
};

export const get = (resource, perPage) => {
  switch(resource) {
    case STRAVA_RESOURCES.activities:
    return getActivities(perPage);
  default:
    return getActivities(perPage);
  }
};