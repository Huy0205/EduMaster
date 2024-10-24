'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '~/context/AuthContext'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { Box } from '@mui/material'

const Header = () => {
  const { loggedIn, setLoggedIn } = useAuth()
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState(null)
  const isDropdownOpen = Boolean(anchorEl)
  
  const handleLoginClick = () => {
    router.push('/login')
  }

  const handleProfileClick = () => {
    router.push('/profile')
    setAnchorEl(null)
  }

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleLogout = () => {
    setLoggedIn(false)
    localStorage.removeItem('loggedIn')
    setAnchorEl(null)
    router.push('/')
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    const storedLoggedIn = localStorage.getItem('loggedIn')
    if (storedLoggedIn === 'true') {
      setLoggedIn(true)
    } else {
      setLoggedIn(false)
    }
  }, [setLoggedIn])

  return (
    <AppBar position="static" sx={{ bgcolor: 'gray.800' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo */}
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => router.push('/')}
        >
          EduMaster
        </Typography>

        {/* Right Side: Conditional Rendering */}
        <Box>
          {loggedIn ? (
            <>
              <IconButton onClick={handleAvatarClick} color="inherit">
                <Avatar src="https://github.com/user-attachments/assets/5ce077ee-b218-48b9-bb41-bd7f53345095" />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={isDropdownOpen}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={handleProfileClick}>Thông tin cá nhân</MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: 'red' }}>Đăng xuất</MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              onClick={handleLoginClick}
              variant="contained"
              color="primary"
              sx={{ bgcolor: 'blue.600' }}
            >
              Đăng nhập
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
