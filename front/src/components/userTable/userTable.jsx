import React from 'react';
import { Table } from 'react-bootstrap';
import NewResult from '../newResult';

function UserTable(props) {
  return (
    <Table responsive striped bordered hover>
      <thead>
        <tr>
          <th>Имя</th>
          <th>Лучшее время (секунды)</th>
          <th>Обновить результат</th>
        </tr>
      </thead>
      <tbody>
        {props.data.rows.map(item => {
          return <tr key={item._id}>
            <td>{item.name}</td>
            <td className="text-center">{item.minTime}</td>
            <td className="text-center"><NewResult id={item._id}/></td>
          </tr>;
        })}
      </tbody>
    </Table>
  );
}

export default UserTable;
