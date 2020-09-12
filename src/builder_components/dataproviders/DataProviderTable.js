import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import CreateDataProvider from './CreateDataProvider';
import EditDataProvider from './EditDataProvider';
import Loader from '../../Loader';
import { createDataProvider, setProviders, fetchProviders, editDataProvider, deleteProvider } from '../../actions/provider';
import { connect } from 'react-redux';

const DataProviderTable = ({ dataProviders, providers, fetchProviders, setProviders, createDataProvider, editDataProvider, deleteProvider, isLoading }) => {
    const [modalState, toggleModal] = useState(false);

    useEffect(() => {
      fetchProviders()
    }, []);

    const create = (name, swaggerUrl) => {
      createDataProvider(name, swaggerUrl);
    }

    const toggle = () => {
      if (providerToEdit) {
        setProviders(providers.map(p => ({ ...p, isEditing: false })));
        toggleModal(false);
      } else {
        toggleModal(!modalState);
      }
    }

    const connect = (id) => {
      window.location.replace(`${process.env.REACT_APP_PLUCKR_API_URI}/providers/connect/${id}/`);
    }

    const providerToEdit = providers.find(p => p.isEditing);

    return (
      <div className="table-wrapper">
        <div className="table-header">
          <h3>Data Providers</h3>
        </div>
        {
          isLoading ? <Loader /> :
          (
            <>
            {providers.length === 0 ? 
              <div className="sad-face"><p style={{ textAlign: 'center' }} className="lead">You need to create a data provider</p></div> :   
              <Table bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th></th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody style={{ lineHeight: '25px' }}>
                  {providers.map((p) => {
                    const canConnect = p.swagger_definition.type === 'oauth2';
                    return (
                      <tr className={p.isConnected ? "table-success" : ""}  key={p.id}>
                        <td className="capitalize">{p.name}{p.is_public ? " - Managed" : null}</td>
                        <td width="40">
                          <button disabled={!canConnect} className="btn btn-link table-btn" onClick={() => connect(p.id)}><i className="fa fa-plug" /></button>
                        </td>
                        <td width="40">
                          <button disabled={!p.isOwner} className="btn btn-link table-btn" onClick={() => editDataProvider(p.id)}><i className="fa fa-edit" /></button>
                        </td>
                        <td width="40">
                          <button disabled={!p.isOwner} className="btn btn-link table-btn" onClick={() => deleteProvider(p.id)}><i className="fa fa-trash" /></button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            }
            </>
          )
        }
        <hr />
        <button onClick={toggle} className="btn btn-primary">Create a Data Provider</button>
        <Modal show={providerToEdit || modalState} onHide={toggle}>
          <Modal.Header closeButton>
            <Modal.Title>{modalState.canEdit ? 'Edit' : 'Create'} a Data Provider</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {
              isLoading ? <Loader /> :
                providerToEdit ? <EditDataProvider provider={providerToEdit} /> : <CreateDataProvider create={create} />
            }
          </Modal.Body>
          <Modal.Footer>
          </Modal.Footer>
        </Modal>
      </div>
    );
}

const mapStateToProps = ({ dataProviders, providers }) => ({ dataProviders, providers: providers.providers, isLoading: providers.isLoading })
const mapDispatchToProps = { createDataProvider, setProviders, fetchProviders, editDataProvider, deleteProvider };

export default connect(mapStateToProps, mapDispatchToProps)(DataProviderTable);