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
const baseUpdRows = { need: false, data: {} };

function App() {
  const [users, setUsers] = useState(baseStructure);
  const [top, setTop] = useState(baseStructure);
  const [alert, setAlert] = useState(baseAlert);

  const [updRows, setUpdRows] = useState(baseUpdRows);

  async function makeRequest(path, param) {
    try {
      const { data } = await axios.get(path, {
        params: {
          page: param.page,
          pageSize: param.pageSize,
        },
      });
      return data;
    } catch (err) {
      setAlert({
        show: true,
        type: 'danger',
        text: 'Что-то пошло не так... Невозможно получить данные.',
      });
      return null;
    }
  }

  async function updateUsers(data = {}) {
    const res = await makeRequest('api/v1/users', { ...{}, ...users, ...data });
    if (res !== null) {
      setUsers(res);
    }
  }

  async function updateTop(data = {}) {
    const res = await makeRequest('api/v1/users/top', { ...{}, ...top, ...data });
    if (res !== null) {
      setTop(res);
    }
  }

  function checkResults(data, eventData, setter) {
    const newRows = data.rows.map((item) => {
      if (item._id === eventData.id) {
        return Object.assign(item, { minTime: eventData.minTime });
      }
      return item;
    });
    setter({ ...data, ...{ rows: newRows } });
  }

  useEffect(() => {
    if (updRows.need === true) {
      checkResults(top, updRows.data, setTop);
      checkResults(users, updRows.data, setUsers);
      setUpdRows(baseUpdRows);
    }
  }, [updRows])

  useEffect(() => {
    const socket = socketIOClient();

    updateUsers();
    updateTop();

    socket.on('user.update', (data) => {
      setUpdRows({need: true, data})
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
          <Col xs={12} md={12} className="text-center">
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
          <Col xs={12} md={12} className="text-center">
            <Jumbotron>
              <h1>Приветсвуем Вас</h1>
              <p>
                Если Вас еще нет в нашем списке, то просто нажмите на кнопку ниже и заполните данные.
              </p>
              <p>
                <NewUser />
              </p>
            </Jumbotron>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
