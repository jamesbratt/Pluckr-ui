
import { DATA_TYPES } from '../Constants';
import { ConvertToEpoch, generateQueryString, injectParametersIntoEndpoint } from '../utils/Helpers';

const STRAVA_URI = 'https://www.strava.com/api/v3';

export const STRAVA_RESOURCES = {
  activities: {
    endpoint: '/athlete/activities',
    name: 'activities',
    label: 'Activities',
    parameters: [
      { name: 'after', type: DATA_TYPES.date, transform: ConvertToEpoch },
      { name: 'before', type: DATA_TYPES.date, transform: ConvertToEpoch },
      { name: 'per_page', type: DATA_TYPES.int },
    ]
  },
  club_activities: {
    endpoint: '/clubs/{id}/activities',
    name: 'club_activities',
    label: 'Club Activities',
    parameters: [
      { name: 'id', type: DATA_TYPES.int },
      { name: 'per_page', type: DATA_TYPES.int },
    ]
  },
  segment_efforts: {
    endpoint: '/segments/{id}/all_efforts',
    name: 'segment_efforts',
    label: 'Segment Efforts',
    parameters: [
      { name: 'id', type: DATA_TYPES.int },
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
  ],
  segment_efforts: [
    'distance',
    'moving_time',
    'elapsed_time',
    'average_watts',
  ]
}

const getActivities = (params) => {
  const token = localStorage.getItem('token');
  const queryString = params.length > 0 ? '?' +
    generateQueryString(
      params,
      'activities',
      STRAVA_RESOURCES['activities'].parameters
    ) : '';

  return fetch(`${STRAVA_URI}${STRAVA_RESOURCES.activities.endpoint}${queryString}`, {
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

const getSegmentEfforts = (params) => {
  const urlComponents = injectParametersIntoEndpoint(
    STRAVA_RESOURCES.segment_efforts.endpoint,
    params,
  )

  const { endPoint } = urlComponents;
  const { parameters } = urlComponents;

  const token = localStorage.getItem('token');
  const queryString = parameters.length > 0 ? '?' +
    generateQueryString(
      parameters,
      'segment_efforts',
      STRAVA_RESOURCES['segment_efforts'].parameters,
    ) : '';

  return fetch(`${STRAVA_URI}${endPoint}${queryString}`, {
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

const getClubActivities = (params) => {
  const urlComponents = injectParametersIntoEndpoint(
    STRAVA_RESOURCES.segment_efforts.endpoint,
    params,
  )

  const { endPoint } = urlComponents;
  const { parameters } = urlComponents;

  const token = localStorage.getItem('token');
  const queryString = parameters.length > 0 ? '?' +
    generateQueryString(
      parameters,
      'club_activities',
      STRAVA_RESOURCES['club_activities'].parameters,
    ) : '';

  return fetch(`${STRAVA_URI}${endPoint}${queryString}`, {
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

export const getData = (resource, params) => {
  let call;
  switch(resource) {
    case STRAVA_RESOURCES.activities.name:
      call = getActivities;
      break;
    case STRAVA_RESOURCES.club_activities.name:
      call = getClubActivities;
      break;
    case STRAVA_RESOURCES.segment_efforts.name:
      call = getSegmentEfforts;
      break;
  default:
    console.error('Invalid');
    break;
  }

  return call(params)
  .then(response => {
    return {
      data: response,
      properties: RESOURCE_PROPERTIES[resource],
    };
  })
};