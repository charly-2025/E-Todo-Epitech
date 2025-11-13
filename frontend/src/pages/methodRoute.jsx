import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from 'react';

export function MyTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchUserTodo = async () => {
      const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3001/user/todos", {
          method: "GET",
          headers: {
            "Authorization": "Bearer "+ token,
            "Content-Type": "application/json",
          }
        });
        const Tododata = await response.json();
        setData(Tododata);
    }
    fetchUserTodo();
  }, []);
  console.log(data);
  if(data.length==0) return (<Typography>No todos for you right now</Typography>)

  return (
      <TableContainer component={Paper} sx={{}}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell align="right">Description</TableCell>
            <TableCell align="right">Due Time</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">{row.title}</TableCell>
              <TableCell align="right">{row.description}</TableCell>
              <TableCell align="right">{row.due_time}</TableCell>
              <TableCell align="right">{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}   