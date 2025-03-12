import React from 'react';
import { Paper, Button, Typography } from '@mui/material';
import { useKiemtraContext } from '~/context/KiemtraContext';

const Topic = ({ data, selected }) => {
    const { setSelectedTopic } = useKiemtraContext();

    const handleSelectTopic = () => {
        setSelectedTopic((prevSelectedTopic) =>
            prevSelectedTopic !== data ? data : prevSelectedTopic,
        );
    };

    return (
        <Paper
            elevation={2}
            sx={{ mb: 2, p: 1 }}
        >
            <Button
                onClick={handleSelectTopic}
                fullWidth
                sx={{
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    backgroundColor: selected ? '#e3f2fd' : 'white',
                    color: selected ? '#1e88e5' : 'black',
                }}
            >
                <Typography variant="subtitle1">{data.name}</Typography>
            </Button>
        </Paper>
    );
};
export default Topic;
