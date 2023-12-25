import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ContentCut from "@mui/icons-material/ContentCut";
import ContentCopy from "@mui/icons-material/ContentCopy";
import ContentPaste from "@mui/icons-material/ContentPaste";
import ListItemText from "@mui/material/ListItemText";
import Cloud from "@mui/icons-material/Cloud";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddCardIcon from "@mui/icons-material/AddCard";
import Button from "@mui/material/Button";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import GroupIcon from "@mui/icons-material/Group";
import CommentIcon from "@mui/icons-material/Comment";
import AttachmentIcon from "@mui/icons-material/Attachment";
const COLUMN_HEADER_HEIGHT = "50px";
const COLUMN_FOOTER_HEIGHT = "50px";
const BoardContent = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box
      sx={{
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#34495e" : "#1976d2",
        width: "100%",
        height: (theme) => theme.trello.boardContentHeight,
        p: "10px 0",
      }}
    >
      <Box
        sx={{
          bgcolor: "inherit",
          width: "100%",
          height: "100%",
          display: "flex",
          overflowX: "auto",
          overflowY: "hidden",
          //thụt cái thnah scroll vào bên trong 2
          "&::-webkit-scrollbar-track": { m: 2 },
        }}
      >
        {/* column */}
        <Box
          sx={{
            minWidth: "300px",
            maxWidth: "300px",
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "#333643" : "#ebecf0",
            ml: 2,
            borderRadius: "6px",
            height: "fit-content",
            maxHeight: (theme) =>
              `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`,
          }}
        >
          {/* header */}
          <Box
            sx={{
              height: COLUMN_HEADER_HEIGHT,
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              Column Title
            </Typography>
            <Box>
              <Tooltip title="More Options">
                <ExpandMoreIcon
                  id="basic-column-dropdown"
                  aria-controls={
                    open ? "basic-menu-column-dropdown" : undefined
                  }
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                  sx={{
                    color: "text.primary",
                    cursor: "pointer",
                  }}
                />
              </Tooltip>

              <Menu
                id="basic-menu-column-dropdown"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-column-dropdown",
                }}
              >
                <MenuItem>
                  <ListItemIcon>
                    <AddCardIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Add new card</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <ContentCut fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Cut</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <ContentCopy fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Copy</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <ContentPaste fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Patse</ListItemText>
                </MenuItem>

                <Divider />

                <MenuItem>
                  <ListItemIcon>
                    <DeleteForeverIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Remove this column</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <Cloud fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Archive this column</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          </Box>
          {/* các cái thẻ */}
          <Box
            sx={{
              p: "0 5px",
              m: "0 5px",
              display: "flex",
              flexDirection: "column",
              gap: 1,
              overflowX: "hidden",
              overflowY: "auto",
              maxHeight: (theme) =>
                `calc(${theme.trello.boardContentHeight} - ${theme.spacing(
                  5
                )} - ${COLUMN_FOOTER_HEIGHT} - ${COLUMN_HEADER_HEIGHT})`,
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#ced0da",
                borderRadius: "8px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#bfc2cf",
              },
            }}
          >
            <Card
              sx={{
                cursor: "pointer",
                boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
                overflow: "unset",
              }}
            >
              <CardMedia
                sx={{ height: 140 }}
                image="https://scontent.fhph2-1.fna.fbcdn.net/v/t39.30808-6/412927530_736517015061525_202832006087506531_n.jpg?stp=dst-jpg_p526x296&_nc_cat=107&ccb=1-7&_nc_sid=c42490&_nc_eui2=AeH68S228PFFPjNxHQwXZ6Y5jF_Pc0zdxFWMX89zTN3EVRwS_eNeXUI5Z4DkV_TzlkZxLZuPi2Sxea3fsH8r7bRs&_nc_ohc=w85HylZ8YnQAX_07tJc&_nc_ht=scontent.fhph2-1.fna&oh=00_AfAmLAjcVotzpgtJ_WDl8_14KeVYQ3y-sD7v_qQ-aibJmw&oe=658ED447"
                title="green iguana"
              />
              <CardContent
                sx={{
                  p: 1.5,
                  "&:last-child": {
                    p: 1.5,
                  },
                }}
              >
                <Typography>ManhTd</Typography>
              </CardContent>
              <CardActions
                sx={{
                  p: "0 4px 8px 4px",
                }}
              >
                <Button size="small" startIcon={<GroupIcon />}>
                  20
                </Button>
                <Button size="small" startIcon={<CommentIcon />}>
                  15
                </Button>
                <Button size="small" startIcon={<AttachmentIcon />}>
                  10
                </Button>
              </CardActions>
            </Card>
            <Card
              sx={{
                cursor: "pointer",
                boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
                overflow: "unset",
              }}
            >
              <CardContent
                sx={{
                  p: 1.5,
                  "&:last-child": {
                    p: 1.5,
                  },
                }}
              >
                <Typography>Card 01</Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                cursor: "pointer",
                boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
                overflow: "unset",
              }}
            >
              <CardContent
                sx={{
                  p: 1.5,
                  "&:last-child": {
                    p: 1.5,
                  },
                }}
              >
                <Typography>Card 01</Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                cursor: "pointer",
                boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
                overflow: "unset",
              }}
            >
              <CardContent
                sx={{
                  p: 1.5,
                  "&:last-child": {
                    p: 1.5,
                  },
                }}
              >
                <Typography>Card 01</Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                cursor: "pointer",
                boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
                overflow: "unset",
              }}
            >
              <CardContent
                sx={{
                  p: 1.5,
                  "&:last-child": {
                    p: 1.5,
                  },
                }}
              >
                <Typography>Card 01</Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                cursor: "pointer",
                boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
                overflow: "unset",
              }}
            >
              <CardContent
                sx={{
                  p: 1.5,
                  "&:last-child": {
                    p: 1.5,
                  },
                }}
              >
                <Typography>Card 01</Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                cursor: "pointer",
                boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
                overflow: "unset",
              }}
            >
              <CardContent
                sx={{
                  p: 1.5,
                  "&:last-child": {
                    p: 1.5,
                  },
                }}
              >
                <Typography>Card 01</Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                cursor: "pointer",
                boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
                overflow: "unset",
              }}
            >
              <CardContent
                sx={{
                  p: 1.5,
                  "&:last-child": {
                    p: 1.5,
                  },
                }}
              >
                <Typography>Card 01</Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                cursor: "pointer",
                boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
                overflow: "unset",
              }}
            >
              <CardContent
                sx={{
                  p: 1.5,
                  "&:last-child": {
                    p: 1.5,
                  },
                }}
              >
                <Typography>Card 01</Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                cursor: "pointer",
                boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
                overflow: "unset",
              }}
            >
              <CardContent
                sx={{
                  p: 1.5,
                  "&:last-child": {
                    p: 1.5,
                  },
                }}
              >
                <Typography>Card 01</Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                cursor: "pointer",
                boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
                overflow: "unset",
              }}
            >
              <CardContent
                sx={{
                  p: 1.5,
                  "&:last-child": {
                    p: 1.5,
                  },
                }}
              >
                <Typography>Card 01</Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                cursor: "pointer",
                boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
                overflow: "unset",
              }}
            >
              <CardContent
                sx={{
                  p: 1.5,
                  "&:last-child": {
                    p: 1.5,
                  },
                }}
              >
                <Typography>Card 01</Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                cursor: "pointer",
                boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
                overflow: "unset",
              }}
            >
              <CardContent
                sx={{
                  p: 1.5,
                  "&:last-child": {
                    p: 1.5,
                  },
                }}
              >
                <Typography>Card 01</Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                cursor: "pointer",
                boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
                overflow: "unset",
              }}
            >
              <CardContent
                sx={{
                  p: 1.5,
                  "&:last-child": {
                    p: 1.5,
                  },
                }}
              >
                <Typography>Card 01</Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                cursor: "pointer",
                boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
                overflow: "unset",
              }}
            >
              <CardContent
                sx={{
                  p: 1.5,
                  "&:last-child": {
                    p: 1.5,
                  },
                }}
              >
                <Typography>Card 01</Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                cursor: "pointer",
                boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
                overflow: "unset",
              }}
            >
              <CardContent
                sx={{
                  p: 1.5,
                  "&:last-child": {
                    p: 1.5,
                  },
                }}
              >
                <Typography>Card 01</Typography>
              </CardContent>
            </Card>
          </Box>

          {/* footer */}
          <Box
            sx={{
              height: COLUMN_FOOTER_HEIGHT,
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Button startIcon={<AddCardIcon />}>Add new card</Button>
            <Tooltip title="Drag to move">
              <DragHandleIcon sx={{ cursor: "pointer" }} />
            </Tooltip>
          </Box>
        </Box>

        {/* colum2 */}
        <Box
          sx={{
            minWidth: "300px",
            maxWidth: "300px",
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "#333643" : "#ebecf0",
            ml: 2,
            borderRadius: "6px",
            height: "fit-content",
            maxHeight: (theme) =>
              `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`,
          }}
        >
          {/* header */}
          <Box
            sx={{
              height: COLUMN_HEADER_HEIGHT,
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              Column Title
            </Typography>
            <Box>
              <Tooltip title="More Options">
                <ExpandMoreIcon
                  id="basic-column-dropdown"
                  aria-controls={
                    open ? "basic-menu-column-dropdown" : undefined
                  }
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                  sx={{
                    color: "text.primary",
                    cursor: "pointer",
                  }}
                />
              </Tooltip>

              <Menu
                id="basic-menu-column-dropdown"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-column-dropdown",
                }}
              >
                <MenuItem>
                  <ListItemIcon>
                    <AddCardIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Add new card</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <ContentCut fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Cut</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <ContentCopy fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Copy</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <ContentPaste fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Patse</ListItemText>
                </MenuItem>

                <Divider />

                <MenuItem>
                  <ListItemIcon>
                    <DeleteForeverIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Remove this column</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <Cloud fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Archive this column</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          </Box>
          {/* các cái thẻ */}
          <Box
            sx={{
              p: "0 5px",
              m: "0 5px",
              display: "flex",
              flexDirection: "column",
              gap: 1,
              overflowX: "hidden",
              overflowY: "auto",
              maxHeight: (theme) =>
                `calc(${theme.trello.boardContentHeight} - ${theme.spacing(
                  5
                )} - ${COLUMN_FOOTER_HEIGHT} - ${COLUMN_HEADER_HEIGHT})`,
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#ced0da",
                borderRadius: "8px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#bfc2cf",
              },
            }}
          >
            <Card
              sx={{
                cursor: "pointer",
                boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
                overflow: "unset",
              }}
            >
              <CardMedia
                sx={{ height: 140 }}
                image="https://scontent.fhph2-1.fna.fbcdn.net/v/t39.30808-6/412927530_736517015061525_202832006087506531_n.jpg?stp=dst-jpg_p526x296&_nc_cat=107&ccb=1-7&_nc_sid=c42490&_nc_eui2=AeH68S228PFFPjNxHQwXZ6Y5jF_Pc0zdxFWMX89zTN3EVRwS_eNeXUI5Z4DkV_TzlkZxLZuPi2Sxea3fsH8r7bRs&_nc_ohc=w85HylZ8YnQAX_07tJc&_nc_ht=scontent.fhph2-1.fna&oh=00_AfAmLAjcVotzpgtJ_WDl8_14KeVYQ3y-sD7v_qQ-aibJmw&oe=658ED447"
                title="green iguana"
              />
              <CardContent
                sx={{
                  p: 1.5,
                  "&:last-child": {
                    p: 1.5,
                  },
                }}
              >
                <Typography>ManhTd</Typography>
              </CardContent>
              <CardActions
                sx={{
                  p: "0 4px 8px 4px",
                }}
              >
                <Button size="small" startIcon={<GroupIcon />}>
                  20
                </Button>
                <Button size="small" startIcon={<CommentIcon />}>
                  15
                </Button>
                <Button size="small" startIcon={<AttachmentIcon />}>
                  10
                </Button>
              </CardActions>
            </Card>
            <Card
              sx={{
                cursor: "pointer",
                boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
                overflow: "unset",
              }}
            >
              <CardContent
                sx={{
                  p: 1.5,
                  "&:last-child": {
                    p: 1.5,
                  },
                }}
              >
                <Typography>Card 01</Typography>
              </CardContent>
            </Card>
          </Box>

          {/* footer */}
          <Box
            sx={{
              height: COLUMN_FOOTER_HEIGHT,
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Button startIcon={<AddCardIcon />}>Add new card</Button>
            <Tooltip title="Drag to move">
              <DragHandleIcon sx={{ cursor: "pointer" }} />
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BoardContent;
