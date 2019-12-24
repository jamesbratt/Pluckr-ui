import { assocPath, merge, pathOr } from 'ramda';
import { executeOperations } from './parse';
import { diff } from 'deep-object-diff';
import { addNotification } from '../actions/notification';
import { receiveDataSources, setLoader, updateSource } from '../actions';

const executeDataUpdates = (
  dataSources,
  dataProviders,
  username,
  apiKey,
  chartId,
  dispatch,
  isUpdate = false,
  preFetchedData = null,
) => {
  const dataSourcesToAddToState = [];
  const dataSourceRequests = dataSources.map(dataSource => {
    if (isUpdate && preFetchedData) {
      return Promise.resolve(preFetchedData);
    } else {
      const provider = dataProviders.find(dataProvider => dataProvider.provider === dataSource.provider);
      return provider.request(
        dataSource.resource,
        JSON.parse(dataSource.params),
        username,
        apiKey,
        dataSource.id
      ).catch((error) => {
        dataSourcesToAddToState.push(dataSource);
        if (isUpdate) {
          dataSourcesToAddToState.forEach(dataSourceToAddToState => {
            dispatch(
              updateSource(
                dataSourceToAddToState
              )
            );
          });
        } else {
          dispatch(
            receiveDataSources(
              dataSourcesToAddToState
            )
          );
        }
        dispatch(setLoader(false));
        dispatch(addNotification({ message: `Error from data provider: ${error.message}`, type: 'error' }));
      });
    }
  });

  Promise.all(dataSourceRequests).then(responses => {

    responses.forEach(response => {
      const sourceConfig = dataSources.find(dataSource => dataSource.id === response.sourceId);
      const source = {
        rawData: response.data,
        properties: response.properties,
      };

      dataSourcesToAddToState.push(merge(sourceConfig, source));
    });

    console.log('fetching datasets');

    fetch(`${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/dataset/?chart=${chartId}`, {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `ApiKey ${username}:${apiKey}`
      },
    })
      .then(response => response.json())
      .then(response => {
        console.log('datasets received');
        const datasetDataUpdates = response.objects.map(dataset => {

          const rawData = dataset.sources.length === 1 ?
            pathOr(null, ['rawData'], dataSourcesToAddToState.find(source => source.id === dataset.sources[0].id)) :
            dataset.sources.reduce((acc, curr) => {
              const data = dataSourcesToAddToState.find(
                source => source.id === curr.id,
              );
              if (data) {
                acc.push(data.rawData);
              }
              return acc;
            }, []);

          if (rawData) {
            console.log('fetching operations for ' + dataset.name);

            return fetch(`${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/operation/?dataset=${dataset.id}`, {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `ApiKey ${username}:${apiKey}`
              },
            })
              .then(response => response.json())
              .then(response => {
                let data = rawData;
                let operations = response.objects.length > 0 ? response.objects.map(operation => {
                  return assocPath(['ast'], JSON.parse(operation.ast), operation);
                }) : response.objects;

                operations.sort(function(a, b) {
                  return a.sort_order - b.sort_order;
                });

                try {
                  data = executeOperations(
                    rawData,
                    dataset,
                    operations,
                  );

                  const isDataDiff = diff(data, JSON.parse(dataset.data));

                  if(Object.entries(isDataDiff).length > 0 && isDataDiff.constructor === Object) {
                    const payload = {
                      data: JSON.stringify(data),
                    };

                    console.log('updating data reference for dataset ' + dataset.name);

                    fetch(`${process.env.REACT_APP_PLUCKR_API_URI}/api/v1/dataset/${dataset.id}/`, {
                      method: 'PATCH',
                      headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `ApiKey ${username}:${apiKey}`
                      },
                      body: JSON.stringify(payload)
                    })
                      .then((response) => response.json())
                      .then(response => {
                      })
                      .catch(error => dispatch(addNotification({ message: error.message, type: 'error' })));
                  } else {
                    Promise.resolve();
                  }

                } catch (error) {
                  dispatch(addNotification({ message: error.message, type: 'error' }));
                }
              })
              .catch(error => dispatch(addNotification({ message: error.message, type: 'error' })));
          }
        });

        Promise.all(datasetDataUpdates).then(responses => {
          console.log('all datasets updated');
          if (isUpdate) {
            dataSourcesToAddToState.forEach(dataSourceToAddToState => {
              dispatch(
                updateSource(
                  dataSourceToAddToState
                )
              );
            });
          } else {
            dispatch(
              receiveDataSources(
                dataSourcesToAddToState
              )
            );
          }
          dispatch(setLoader(false));
        });
      })
  })
}

export default executeDataUpdates;