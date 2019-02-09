
import { DATA_TYPES } from '../Constants';

const STRAVA_URI = 'https://www.strava.com/api/v3';

export const STRAVA_RESOURCES = {
  activities: {
    endpoint: '/athlete/activities',
    name: 'activities',
    label: 'Activities',
    parameters: [
      { name: 'before', type: DATA_TYPES.date },
      { name: 'after', type: DATA_TYPES.date },
      { name: 'per_page', type: DATA_TYPES.int },
    ]
  }
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
  return fetch(`${STRAVA_URI}${STRAVA_RESOURCES.activities.endpoint}?per_page=${perPage}`, {
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

export const getProfile = (perPage) => {
  const token = localStorage.getItem('token');
  return fetch(`${STRAVA_URI}/athlete`, {
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
  let call;
  switch(resource) {
    case STRAVA_RESOURCES.activities.name:
    call = getActivities;
    break;
  default:
    console.error('Invalid');
    break;
  }

  return call(perPage)
  .then(response => {
    return {
      data: response,
      properties: RESOURCE_PROPERTIES.activities,
    };
  })
};

export const get = (resource, perPage) => {
  switch(resource) {
    case STRAVA_RESOURCES.activities:
    return getActivities(perPage);
  default:
    return getActivities(perPage);
  }
};