'use client'
import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ListUserPage = () => {
  // Sample list of users
  const users = [
    {
      id: 1,
      username: 'user1',
      name: 'Người dùng 1',
      email: 'user1@example.com',
      phone: '0123456789',
      grade: 'Lớp 5',
      role: 'Admin',
    },
    {
      id: 2,
      username: 'user2',
      name: 'Người dùng 2',
      email: 'user2@example.com',
      phone: '0987654321',
      grade: 'Lớp 4',
      role: 'User',
    },
    {
      id: 3,
      username: 'user3',
      name: 'Người dùng 3',
      email: 'user3@example.com',
      phone: '0123456789',
      grade: 'Lớp 3',
      role: 'User',
    },
  ];

  const handleEdit = (id) => {
    // Logic to edit user with the given id
    console.log(`Edit user with id: ${id}`);
  };

  const handleDelete = (id) => {
    // Logic to delete user with the given id
    console.log(`Delete user with id: ${id}`);
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" sx={{ marginBottom: '20px' }}>
        Danh sách tài khoản
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tài khoản</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Lớp</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.grade}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(user.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(user.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ListUserPage;
