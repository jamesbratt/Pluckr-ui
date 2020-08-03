import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import CreateDataProvider from './CreateDataProvider';
import EditDataProvider from './EditDataProvider';
import { createDataProvider, setProviders, fetchProviders } from '../../actions/provider';
import { connect } from 'react-redux';

const DataProviderTable = ({ dataProviders, providers, fetchProviders, setProviders, createDataProvider }) => {
    const [modalState, toggleModal] = useState(false);

    useEffect(() => {
      fetchProviders()
    }, []);

    const create = (name, swaggerUrl) => {
      createDataProvider(name, swaggerUrl);
    }

    const toggle = () => {
      if (canEdit) {
        setProviders(providers.map(p => p.provider));
      }

      toggleModal(!modalState);
    }

    const canEdit = providers.find(p => p.isEditing);

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
            {dataProviders.filter(dataProvider => !dataProvider.isDisabled).map((dataProvider) => {
              return (
                <tr className={dataProvider.isActive ? "table-success" : ""} key={dataProvider.provider}>
                  <td style={{ textAlign: 'center' }} width="60"><img height={25} src={dataProvider.icon} alt={dataProvider.provider} /></td>
                  <td className="capitalize">{dataProvider.provider}</td>
                  <td width="40">
                    {dataProvider.isActive || dataProvider.isDisabled ? null : <a href={dataProvider.redirectUrl}><i className="fa fa-plug" /></a>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
        <hr />
        <button onClick={toggle} className="btn btn-primary">Create a Data Provider</button>
        <Modal show={modalState} onHide={toggle}>
          <Modal.Header closeButton>
            <Modal.Title>{modalState.canEdit ? 'Edit' : 'Create'} a Data Provider</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {canEdit ? <EditDataProvider /> : <CreateDataProvider create={create} />}
          </Modal.Body>
          <Modal.Footer>
          </Modal.Footer>
        </Modal>
      </div>
    );
}

const mapStateToProps = ({ dataProviders, providers }) => ({ dataProviders, providers })
const mapDispatchToProps = { createDataProvider, setProviders, fetchProviders };

export default connect(mapStateToProps, mapDispatchToProps)(DataProviderTable);