import React, { useState, useEffect } from 'react';
import {
  Jumbotron, Container, Row, Col, Alert,
} from 'react-bootstrap';
import axios from 'axios';
import socketIOClient from 'socket.io-client';

import './app.css';
import TopTable from '../topTable';
import UserTable from '../userTable';
import NewUser from '../newUser';
import Paginator from '../paginator';

const baseStructure = {
  rows: [],
  page: 1,
  total: 0,
  pageSize: 5,
  totalPages: 1,
};
const baseAlert = { show: false, type: 'warning', text: '' };

function App() {
  const [users, setUsers] = useState(baseStructure);
  const [top, setTop] = useState(baseStructure);
  const [alert, setAlert] = useState(baseAlert);

  async function makeRequest(path, param) {
    const { data } = await axios.get(path, {
      params: {
        page: param.page,
        pageSize: param.pageSize,
      },
    });
    return data;
  }

  async function updateUsers(data = {}) {
    try {
      const res = await makeRequest('api/v1/users', { ...{}, ...users, ...data });
      setUsers(res);
    } catch (err) {
      setAlert({
        show: true,
        type: 'danger',
        text: 'Что-то пошло не так... Невозможно получить данные.',
      });
    }
  }

  async function updateTop(data = {}) {
    try {
      const res = await makeRequest('api/v1/users/top', { ...{}, ...top, ...data });
      // setTop((top) => ({ ...top, ...res }));
      setTop(res);
    } catch (err) {
      setAlert({
        show: true,
        type: 'danger',
        text: 'Что-то пошло не так... Невозможно получить данные.',
      });
    }
  }

  // function checkResults(data, eventData, setter) {
  //   const newRows = data.rows.map((item) => {
  //     if (item._id === eventData.id) {
  //       return Object.assign(item, { minTime: eventData.minTime });
  //     }
  //     return item;
  //   });
  //   setter(dataObject.assign({}, data, { rows: newRows }));
  // }

  useEffect(() => {
    const socket = socketIOClient();
    // socket.on('connect', (data) => {
    //   console.log('connected', data);
    // });

    updateUsers();
    updateTop();

    socket.on('user.update', () => {
      // checkResults(top, data, setTop);
      // checkResults(users, data, setUsers);
      updateUsers();
      updateTop();
    });

    socket.on('user.create', () => {
      updateUsers();
      updateTop();
    });
  }, []);

  return (
    <div>
      <Container>
        <Row>
          <Col xs={12} md={12}>
            <Jumbotron>
              <h1>Добро пожаловать на страничку нашего бассейна</h1>
            </Jumbotron>
            {
              alert && alert.show ? (
                <Alert variant={alert.type} onClose={() => setAlert(baseAlert)} dismissible>
                  <Alert.Heading>{alert.text}</Alert.Heading>
                </Alert>
              ) : ''
            }
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6}>
            <h1>Список спортсменов</h1>
            <UserTable data={users} />
            <Paginator
              data={users}
              handlePageClick={(data) => {
                const page = data.selected + 1;
                if (page !== users.page) { updateUsers({ page }); }
              }}
            />
          </Col>
          <Col xs={12} md={6}>
            <h1>Топ</h1>
            <TopTable data={top} />
            <Paginator
              data={top}
              handlePageClick={(data) => {
                const page = data.selected + 1;
                if (page !== top.page) { updateTop({ page }); }
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12}>
            <NewUser />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
