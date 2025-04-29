'use clent';

import styles from "./accountMenu.module.css";
import { useState } from 'react';
import { useLogout } from '../GlobalContext';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { BeachAccess, Luggage, Person, Logout, Apartment, Badge, BookOnline } from "@mui/icons-material";

const slotProps = {
    paper: {
        elevation: 0,
        sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
            },
            '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 19,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
            }
        }
    }
};

const linkListItemStyle = {
    display: "flex",
    alignItems: "center",
    p: 0
};

const adminMenuItems = [
    ["hotel", Apartment, "отель"],
    ["tour", Luggage, "тур"],
    ["resort", BeachAccess, "курорт"],
    ["employee", Badge, "сотрудника"],
];

const AccountMenu = ({ user, isAdmin }) => {
    const logout = useLogout();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = !!anchorEl;

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
        document.scrollingElement.style.overflow = "hidden";
    }

    const handleClose = () => {
        setAnchorEl(null);
        document.scrollingElement.style.overflow = "auto";
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        handleClose();
        logout();
    }

    return (
        <>
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
            <Tooltip title="Аккаунт">
            <IconButton
                onClick={handleClick}
                size="small"
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                sx={{p: 0}}
            >
                <Avatar sx={{ width: 48, height: 48 }}>
                    {isAdmin ? 'А' : `${user.name[0]}${user.surname[0]}`}
                </Avatar>
            </IconButton>
            </Tooltip>
            <Typography sx={{ ml: 1 }}>
                {isAdmin ? 'Администратор' : `${user.name} ${user.surname[0]}.`}
            </Typography>
        </Box>
        <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            slotProps={slotProps}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <MenuItem sx={{ cursor: "default" }}>
                <Avatar /> {isAdmin ? 'Администратор' : `${user.name} ${user.surname}`}
            </MenuItem>
            <Divider />
            {
                isAdmin ?
                adminMenuItems.map(([page, Icon, item]) => (
                    <MenuItem key={item} onClick={handleClose} sx={linkListItemStyle}>
                        <Link href={`/admin/add-${page}`} className={styles.link}>
                            <ListItemIcon>
                                <Icon fontSize="small" />
                            </ListItemIcon>
                            Добавить {item}
                        </Link>
                    </MenuItem>
                )) :
                <MenuItem onClick={handleClose} sx={linkListItemStyle}>
                    <Link href={`/users/${user.id}`} className={styles.link}>
                        <ListItemIcon>
                            <Person fontSize="small" />
                        </ListItemIcon>
                        Мой кабинет
                    </Link>
                </MenuItem>
            }
            {
                user.role === "EMPL" ?
                [
                    ["new", "Новые бронирования", 1],
                    [user.id, "Бронирования, с которыми вы работаете", 2]
                ].map(([page, text, key]) => (
                    <MenuItem key={key} onClick={handleClose} sx={linkListItemStyle}>
                        <Link href={`/bookings/${page}`} className={styles.link}>
                            <ListItemIcon>
                                <BookOnline fontSize="small" />
                            </ListItemIcon>
                            {text}
                        </Link>
                    </MenuItem>
                )) : null
            }
            <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                    <Logout fontSize="small" />
                </ListItemIcon>
                Выйти
            </MenuItem>
        </Menu>
        </>
    );
}

export default AccountMenu;