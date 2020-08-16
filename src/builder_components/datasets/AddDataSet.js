import React from 'react';
import GenerateRequest from '../../utils/GenerateRequest';

import { createDataSet } from '../../actions/dataset';
import { addNotification } from '../../actions/notification';
import { connect } from 'react-redux';
import { extractGlobalParameters } from '../../utils/Helpers';

const dataSetNameRef = React.createRef();
const dataSetSourceRef = React.createRef();

const getRawData = async (providers, dataSources, username, apiKey) => {
  const rawData = dataSources.map((source) => {
    const provider = providers.find(provider => provider.id === source.data_provider_id);
    const parametersModel = extractGlobalParameters(provider, source.resource);
    return GenerateRequest(
      provider,
      source.resource,
      source.params,
      parametersModel,
      source.id ? parseInt(source.id) : null,
      username, apiKey,
    ).catch((error) => {});
  });

  return Promise.all(rawData).then(responses => {
    const rawData = responses.length > 1 ? responses.reduce((acc, curr) => {
      acc.push(curr.data);
      return acc;
    }, []) : responses[0];

    return rawData;
  });
}

const mapStateToProps = (state) => {
  return {
    sources: state.sources.data,
    user: state.user[0],
    providers: state.providers.map(p => p.provider),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createDataSet: (apiKey, username, name, chartId, sourceId, data) => {
      dispatch(createDataSet(
        apiKey,
        username,
        name,
        chartId,
        sourceId,
        data,
      ));
    },
    addNotification: (data) => {
      dispatch(addNotification(data))
    }
  };
};

const AddDataSet = (props) => {

  const add = async () => {
    const { value } = dataSetNameRef.current;
    const { options } = dataSetSourceRef.current;
    if(value) {
      const selectedOptions = [];
      for (let i = 0, l = options.length; i < l; i++) {
        if (options[i].selected) {
          selectedOptions.push({pk: options[i].value});
        }
      }

      const sources = selectedOptions.reduce((acc, curr) => {
        const data = props.sources.find(
          source => source.id === parseInt(curr.pk),
        );
        acc.push(data);
        return acc;
      }, []);

      const user = props.user.username;
      const apiKey = props.user.api_key;

      const rawData = await getRawData(props.providers, sources, user, apiKey);

      props.add(
        dataSetNameRef.current.value,
        props.chartId,
        selectedOptions,
        rawData,
      );

    } else {
      props.addNotification({ message: 'Fill out all required dataset fields', type: 'error' });
    }
  }

  return (
    <React.Fragment>
      <div className="form-group">
        <label>Dataset Name</label>
        <input ref={dataSetNameRef} className="form-control" type="text" placeholder="Dataset title" />
      </div>
      <div className="form-group">
        <label>Data Source</label>
        <select multiple={true} ref={dataSetSourceRef} className="form-control">
          {props.sources.map(source => {
            if(source.chart === parseInt(props.chartId)) {
              return <option key={source.name} value={source.id}>{source.name}</option>;
            }
          })}
        </select>
      </div>
      <button onClick={add} className="btn btn-primary my-2 my-sm-0" type="submit">New Dataset</button>
    </React.Fragment>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddDataSet);