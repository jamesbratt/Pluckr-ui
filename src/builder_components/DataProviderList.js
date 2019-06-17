import React from 'react';

const DataProviderList = (props) => {

  const dataProviders = props.dataProviders.map((dataProvider) => {
    return (
      <li class="media">
        <div class="media-body">
          <h5 class="mt-0 mb-1"><a href={dataProvider.redirectUrl}>{dataProvider.provider}</a></h5>
          Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
        </div>
      </li>
    );
  })

  return (
    <ul class="list-unstyled">
      {dataProviders}
    </ul>
  );
}

export default DataProviderList;