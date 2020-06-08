import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

function NewResult(props) {
  const [show, setShow] = useState(false);
  const [result, setResult] = useState(null);

  function handleClose() {
    setShow(false);
  }

  function handleShow() {
    setShow(true);
  }

  // TODO: Refactor block of "catch", remove "alert" and add error handler
  async function sendResult(e) {
    e.preventDefault();
    try {
      await axios.put(`/api/v1/users/${props.id}/results`, {
        result: Number(result),
      });
    } catch (err) {
      alert('Something went wrong.');
    }
    handleClose();
  }

  function changeResult(e) {
    setResult(e.target.value);
  }
  // TODO: Fix warning about findDOMMode
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        +
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Добавить новый результат</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Заполните, пожалуйста, форму</p>

          <Form onSubmit={sendResult}>
            <Form.Group controlId="formEmail">
              <Form.Label>Результат</Form.Label>
              <Form.Control
                type="number"
                placeholder="Введите результат в секундах"
                onChange={changeResult}
                value={result || ''}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Добавить
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default NewResult;
