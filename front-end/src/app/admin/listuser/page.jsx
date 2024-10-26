'use client';
import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Paper,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

import { UserService } from '~/services';

const ListUserPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isEditing] = useState(false);
    const fetchUsers = async () => {
        try {
            // const response = await axios.get('http://localhost:8080/api/v1/user/role/1');
            const response = await UserService.getUserByRole(1);
            console.log('Fetched users:', response.data);
            setUsers(response.data.users);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditOpen = (user) => {
        setCurrentUser(user);
        setOpen(true);
    };

    const handleEditClose = () => {
        setOpen(false);
        setCurrentUser(null);
    };

    const handleEditChange = (event) => {
        setCurrentUser({
            ...currentUser,
            [event.target.name]: event.target.value,
        });
    };
    const phoneNumberPattern = /^\d{10}$/;
    const handleUpdate = async () => {
        try {
            if (!phoneNumberPattern.test(currentUser.phoneNumber)) {
                alert('Số điện thoại phải gồm đúng 10 số.');
                return;
            }
            await axios.put(
                `http://localhost:8080/api/v1/user/update/${currentUser.id}`,
                currentUser,
            );
            console.log(`Update user with id: ${currentUser.id} success`);

            // Cập nhật danh sách người dùng sau khi cập nhật
            setUsers(users.map((user) => (user.id === currentUser.id ? currentUser : user)));
            handleEditClose(); // Đóng dialog
        } catch (error) {
            console.error(`Error updating user with id ${currentUser.id}:`, error);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa người dùng này không?');

        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8080/api/v1/user/${id}`);
                console.log(`Delete user with id: ${id} success`);

                // Cập nhật danh sách người dùng sau khi xóa
                setUsers(users.filter((user) => user.id !== id));
            } catch (error) {
                console.error(`Error deleting user with id ${id}:`, error);
            }
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <Box sx={{ padding: '20px' }}>
            <Typography
                variant="h4"
                sx={{ marginBottom: '20px' }}
            >
                Danh Sách Tài Khoản
            </Typography>

            {loading ? (
                <Typography variant="body1">Loading...</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Tài khoản</TableCell>
                                <TableCell>Tên</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Lớp</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {Array.isArray(users) && users.length > 0 ? (
                                users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.fullName}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.phoneNumber}</TableCell>
                                        <TableCell>{user.currentGrade}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleEditOpen(user)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                color="secondary"
                                                onClick={() => handleDelete(user.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7}>Không có dữ liệu người dùng.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Dialog Edit User */}
            <Dialog
                open={open}
                onClose={handleEditClose}
            >
                <DialogTitle>Chỉnh sửa thông tin người dùng</DialogTitle>
                <DialogContent>
                    {currentUser && (
                        <>
                            <DialogContentText>
                                Vui lòng chỉnh sửa thông tin người dùng.
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                name="fullName"
                                label="Tên"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={currentUser.fullName}
                                onChange={handleEditChange}
                            />
                            <TextField
                                margin="dense"
                                name="email"
                                label="Email"
                                type="email"
                                fullWidth
                                variant="outlined"
                                value={currentUser.email}
                                InputProps={{
                                    readOnly: !isEditing,
                                }}
                            />
                            <TextField
                                margin="dense"
                                name="phoneNumber"
                                label="Số điện thoại"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={currentUser.phoneNumber}
                                onChange={handleEditChange}
                            />
                            <TextField
                                margin="dense"
                                name="currentGrade"
                                label="Lớp"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={currentUser.currentGrade}
                                onChange={handleEditChange}
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleEditClose}
                        color="primary"
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleUpdate}
                        color="primary"
                    >
                        Xong
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ListUserPage;
