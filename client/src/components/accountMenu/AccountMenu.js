"use client";

import { useState } from "react";
import useAuth from "@/hooks/auth.hook";
import Link from "next/link";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";

import styles from "./accountMenu.module.css";
import { slotProps, linkListItemStyle } from "./constants";
import { getUserMenuItems } from "./utils";

const AccountMenu = ({ user, isAdmin }) => {
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = !!anchorEl;

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
    document.scrollingElement.style.overflow = "hidden";
  };

  const handleClose = () => {
    setAnchorEl(null);
    document.scrollingElement.style.overflow = "auto";
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  const menuItems = getUserMenuItems(isAdmin, user.id, user.role);

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Аккаунт">
          <IconButton
            onClick={handleClick}
            size="small"
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            sx={{ p: 0 }}
          >
            <Avatar sx={{ width: 48, height: 48 }}>
              {isAdmin ? "А" : `${user.name[0]}${user.surname[0]}`}
            </Avatar>
          </IconButton>
        </Tooltip>
        <Typography sx={{ ml: 1 }}>
          {isAdmin ? "Администратор" : `${user.name} ${user.surname[0]}.`}
        </Typography>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={slotProps}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem sx={{ cursor: "default" }}>
          <Avatar />{" "}
          {isAdmin ? "Администратор" : `${user.name} ${user.surname}`}
        </MenuItem>
        <Divider />
        {menuItems.map(({ href, Icon, text }) => (
          <MenuItem key={href} onClick={handleClose} sx={linkListItemStyle}>
            <Link href={href} className={styles.link}>
              <ListItemIcon>
                <Icon fontSize="small" />
              </ListItemIcon>
              {text}
            </Link>
          </MenuItem>
        ))}
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Выйти
        </MenuItem>
      </Menu>
    </>
  );
};

export default AccountMenu;
