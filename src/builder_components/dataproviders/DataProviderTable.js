import React from 'react';
import Table from 'react-bootstrap/Table';
import { connect } from 'react-redux';

const DataProviderTable = ({ dataProviders }) => {
    return (
      <div className="table-wrapper">
        <Table bordered hover>
          <thead>
            <tr>
              <th></th>
              <th>Data Provider</th>
              <th></th>
            </tr>
          </thead>
          <tbody style={{ lineHeight: '25px' }}>
            {dataProviders.map((dataProvider) => {
              return (
                <tr className={dataProvider.isActive ? "table-success" : ""} key={dataProvider.provider}>
                  <td style={{ textAlign: 'center' }} width="60"><img height={25} src={dataProvider.icon} alt={dataProvider.provider} /></td>
                  <td className="capitalize">{dataProvider.provider} {dataProvider.isDisabled ? '(Coming Soon)' : null}</td>
                  <td width="40">
                    {dataProvider.isActive || dataProvider.isDisabled ? null : <a href={dataProvider.redirectUrl}><i className="fa fa-plug" /></a>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
    );
}

const mapStateToProps = ({ dataProviders }) => ({ dataProviders })

export default connect(mapStateToProps)(DataProviderTable);