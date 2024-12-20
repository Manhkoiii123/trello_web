import ModeSelect from "~/components/ModeSelect/ModeSelect";
import Box from "@mui/material/Box";
import AppsIcon from "@mui/icons-material/Apps";
import { ReactComponent as TrelloIcon } from "~/assets/trello.svg";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import WorkSpace from "./Menus/WorkSpace";
import Recent from "./Menus/Recent";
import Starred from "./Menus/Starred";
import Templates from "./Menus/Templates";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Badge from "@mui/material/Badge";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Profiles from "./Menus/Profiles";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { Link } from "react-router-dom";
import Notifications from "./Notifications/Notifications";
const AppBar = () => {
  const [searchValue, setSearchValue] = useState("");
  return (
    <Box
      px={2}
      sx={{
        width: "100%",
        height: (theme) => theme.trello.appBarHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        overflowX: "auto",
        "&::-webkit-scrollbar-track": { m: 2 },
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#2c3e50" : "#1565c0",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Link to="/boards">
          <Tooltip title="Back to boards">
            <AppsIcon sx={{ color: "white", verticalAlign: "middle" }} />
          </Tooltip>
        </Link>

        <Link to="/" style={{ color: "white" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <SvgIcon
              component={TrelloIcon}
              inheritViewBox
              fontSize="small"
              sx={{ color: "white" }}
            />
            <Typography
              variant="span"
              sx={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                color: "white",
              }}
            >
              Trello
            </Typography>
          </Box>
        </Link>
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
          <WorkSpace />
          <Recent />
          <Starred />
          <Templates />
          <Button
            sx={{
              color: "white",
              border: "none",
              "&:hover": {
                border: "none",
              },
            }}
            variant="outlined"
            startIcon={<LibraryAddIcon />}
          >
            Create
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          sx={{
            minWidth: 120,
            maxWidth: "180px",
            "& label": { color: "white" },
            "& input": { color: "white" },
            "& label.Mui-focused": { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "white",
              },
              "&:hover fieldset": {
                borderColor: "white",
              },
              "&.Mui-focused fieldset": {
                borderColor: "white",
              },
            },
          }}
          id="outlined-search"
          label="Search..."
          type="text"
          size="small"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "white" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <CloseIcon
                  fontSize="small"
                  onClick={() => setSearchValue("")}
                  sx={{
                    color: searchValue ? "white" : "transparent",
                    cursor: "pointer",
                  }}
                />
              </InputAdornment>
            ),
          }}
        />
        <ModeSelect />
        <Notifications />
        <Tooltip title="Help">
          <HelpOutlineIcon sx={{ cursor: "pointer", color: "white" }} />
        </Tooltip>
        <Profiles />
      </Box>
    </Box>
  );
};

export default AppBar;
