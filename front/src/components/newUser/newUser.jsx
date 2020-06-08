import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

function NewResult() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [result, setResult] = useState(null);

  function handleClose() {
    setShow(false);
  }

  function handleShow() {
    setShow(true);
  }

  async function sendResult(e) {
    e.preventDefault();
    try {
      await axios.post('/api/v1/users/', {
        name,
        email,
        result: Number(result),
      });
    } catch (err) {
      alert('Something went wrong.'); // @TODO заменить
    }
    handleClose();
  }

  function changeName(e) {
    setName(e.target.value);
  }

  function changeResult(e) {
    setResult(e.target.value);
  }

  function changeEmail(e) {
    setEmail(e.target.value);
  }

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Добавить нового спортсмена
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Добавить нового спортсмена</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Заполните, пожалуйста, форму</p>

          <Form onSubmit={sendResult}>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Введите email"
                onChange={changeEmail}
                value={email || ''}
              />
              <Form.Text className="text-muted">
                Спамить не будет =)
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formName">
              <Form.Label>Имя</Form.Label>
              <Form.Control
                type="string"
                placeholder="Введите имя"
                onChange={changeName}
                value={name || ''}
              />
            </Form.Group>
            <Form.Group controlId="formResult">
              <Form.Label>Результат</Form.Label>
              <Form.Control
                type="string"
                placeholder="Введите результат в секундах, если необходимо"
                onChange={changeResult}
                value={result || ''}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Создать
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default NewResult;
