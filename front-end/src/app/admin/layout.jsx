'use client';
import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemText, ListItemIcon, Collapse } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SchoolIcon from '@mui/icons-material/School';
import BookIcon from '@mui/icons-material/Book';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useRouter } from 'next/navigation';
import Header from '~/components/Header'; // Import Header component

const AdminLayout = ({ children }) => {
  const [open, setOpen] = useState({ account: false, lesson: false, review: false, test: false });
  const router = useRouter();

  const handleClick = (section) => {
    setOpen({ ...open, [section]: !open[section] });
  };

  const handleNavigate = (path) => {
    router.push(path);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header spans the entire top */}
      <Box sx={{ width: '100%', position: 'fixed', top: 0 }}>
        <Header />
      </Box>

      {/* Content below the header */}
      <Box sx={{ display: 'flex', flexGrow: 1, mt: 8 /* Adjust for header height */ }}>
        {/* Drawer on the left */}
        <Drawer
          sx={{
            width: 240,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 240,
              boxSizing: 'border-box',
              mt: '64px', // Adjust for header height
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <List>
            {/* Tài khoản Section */}
            <ListItem button onClick={() => handleClick('account')}>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Tài khoản" />
              {open.account ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open.account} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button sx={{ pl: 4 }} onClick={() => handleNavigate('/admin/adduser')}>
                  <ListItemText primary="Thêm" />
                </ListItem>
                <ListItem button sx={{ pl: 4 }} onClick={() => handleNavigate('/admin/listuser')}>
                  <ListItemText primary="Danh sách" />
                </ListItem>
              </List>
            </Collapse>

            {/* Bài học Section */}
            <ListItem button onClick={() => handleClick('lesson')}>
              <ListItemIcon>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText primary="Bài học" />
              {open.lesson ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open.lesson} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button sx={{ pl: 4 }} onClick={() => handleNavigate('/admin/addlecture')}>
                  <ListItemText primary="Thêm" />
                </ListItem>
                <ListItem button sx={{ pl: 4 }} onClick={() => handleNavigate('/admin/listlecture')}>
                  <ListItemText primary="Danh sách" />
                </ListItem>
              </List>
            </Collapse>

            {/* Bài ôn Section */}
            <ListItem button onClick={() => handleClick('review')}>
              <ListItemIcon>
                <BookIcon />
              </ListItemIcon>
              <ListItemText primary="Bài ôn" />
              {open.review ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open.review} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button sx={{ pl: 4 }} onClick={() => handleNavigate('/admin/addreview')}>
                  <ListItemText primary="Thêm" />
                </ListItem>
                <ListItem button sx={{ pl: 4 }} onClick={() => handleNavigate('/admin/listReview')}>
                  <ListItemText primary="Danh sách" />
                </ListItem>
              </List>
            </Collapse>

            {/* Bài kiểm tra Section */}
            <ListItem button onClick={() => handleClick('test')}>
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="Bài kiểm tra" />
              {open.test ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open.test} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button sx={{ pl: 4 }} onClick={() => handleNavigate('/admin/addquiz')}>
                  <ListItemText primary="Thêm" />
                </ListItem>
                <ListItem button sx={{ pl: 4 }} onClick={() => handleNavigate('/admin/listquiz')}>
                  <ListItemText primary="Danh sách" />
                </ListItem>
              </List>
            </Collapse>
          </List>
        </Drawer>

        {/* Main content area */}
        <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
