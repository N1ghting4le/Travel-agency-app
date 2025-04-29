'use client';

import styles from "./menu.module.css";
import { IconButton } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { MoreVert } from '@mui/icons-material';
import Link from 'next/link';
import { useState } from 'react';

export default function HeaderMenu() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = !!anchorEl;
    const handleClick = (event) => {
        document.scrollingElement.style.overflow = "hidden";
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        document.scrollingElement.style.overflow = "auto";
        setAnchorEl(null);
    };

    return (
        <div className={styles.menu}>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVert />
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    list: {'aria-labelledby': 'basic-button'}
                }}
            >
                <MenuItem onClick={handleClose} sx={{p: 0}}>
                    <Link href="/sign-in" className={styles.link}>Войти</Link>
                </MenuItem>
                <MenuItem onClick={handleClose} sx={{p: 0}}>
                    <Link href="/sign-up" className={styles.link}>Зарегистрироваться</Link>
                </MenuItem>
            </Menu>
        </div>
    );
}