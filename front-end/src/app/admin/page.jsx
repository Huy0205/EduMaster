'use client'
import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemText, ListItemIcon, Collapse } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SchoolIcon from '@mui/icons-material/School';
import BookIcon from '@mui/icons-material/Book';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useRouter } from 'next/navigation'

const AdminLayout  = ({ children }) => {
  const [open, setOpen] = useState({ account: false, lesson: false, review: false, test: false });
  const router = useRouter()

  const handleClick = (section) => {
    setOpen({ ...open, [section]: !open[section] });
  };

  const handleNavigate = (path) => {
    router.push(path);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Content Area */}
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        {/* Your content will go here */}
        <h1>Welcome to Dashboard</h1>
      </Box>
    </Box>
  );
};

export default AdminLayout;
