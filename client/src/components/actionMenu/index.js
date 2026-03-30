"use client";

import { useState } from "react";
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

export function ActionMenu({ actions }) {
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

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        aria-controls={open ? "action-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <MoreVert />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {actions.map(
          ({ action, disabled = false, tooltipText = null, children }, i) => (
            <Tooltip key={i} title={tooltipText}>
              <span>
                <MenuItem onClick={action} {...{ disabled }}>
                  {children}
                </MenuItem>
              </span>
            </Tooltip>
          ),
        )}
      </Menu>
    </>
  );
}
