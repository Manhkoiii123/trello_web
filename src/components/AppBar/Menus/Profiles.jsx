import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import { useState } from "react";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { useDispatch, useSelector } from "react-redux";
import { logoutUserApi } from "~/redux/user/userSlice";
import { selectCurrentUser } from "~/redux/user/userSlice";
import { useConfirm } from "material-ui-confirm";
import { Link } from "react-router-dom";
const Profiles = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const confirmLogout = useConfirm();
  const currentUser = useSelector(selectCurrentUser);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    confirmLogout({
      description: "Are you sure you want to logout?",
      confirmationText: "Logout",
      cancellationText: "Cancel",
    })
      .then(() => {
        dispatch(logoutUserApi());
      })
      .catch(() => {});
  };
  return (
    <Box>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ padding: 0 }}
          aria-controls={open ? "basic-menu-profiles" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar
            alt="avatar"
            sx={{ width: 34, height: 34 }}
            src={currentUser?.avatar}
          />
        </IconButton>
      </Tooltip>
      <Menu
        id="basic-menu-profiles"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button-profiles",
        }}
      >
        <Link
          to="/settings/account"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <MenuItem>
            <Avatar
              sx={{ width: 28, height: 28, mr: 2 }}
              src={currentUser?.avatar}
            />
            Profile
          </MenuItem>
        </Link>
        <MenuItem>
          <Avatar sx={{ width: 28, height: 28, mr: 2 }} /> My account
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem
          onClick={handleLogout}
          sx={{
            "&:hover": {
              color: "warning.dark",
              "& .logout-icon": {
                color: "warning.dark",
              },
            },
          }}
        >
          <ListItemIcon>
            <Logout className="logout-icon" fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Profiles;
