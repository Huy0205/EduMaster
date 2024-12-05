import React from 'react';
import { Paper, Button, Typography } from '@mui/material';
const Topic = ({ title, isActive, onClick }) => {
    return (
        <Paper elevation={2} sx={{ mb: 2, p: 1 }}>
            <Button
                onClick={onClick}
                fullWidth
                sx={{
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    backgroundColor: isActive ? '#e3f2fd' : 'white',
                    color: isActive ? '#1e88e5' : 'black',
                }}
            >
                <Typography variant="subtitle1">{title}</Typography>
            </Button>
        </Paper>
    );
};
export default Topic