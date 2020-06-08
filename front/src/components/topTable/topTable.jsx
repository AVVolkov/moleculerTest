import React from 'react';
import { Table } from 'react-bootstrap';

function TopTable(props) {
  return (
    <Table responsive striped bordered hover>
      <thead>
        <tr>
          <th>Имя</th>
          <th>Лучшее время (секунды)</th>
        </tr>
      </thead>
      <tbody>
        {props.data.rows.map((item) => (
          <tr key={item._id}>
            <td>{item.name}</td>
            <td className="text-center">{item.minTime}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default TopTable;
