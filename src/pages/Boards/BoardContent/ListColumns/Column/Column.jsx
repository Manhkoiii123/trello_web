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
import Box from "@mui/material/Box";
import { useState } from "react";
import ListCards from "./ListCards/ListCards";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { useConfirm } from "material-ui-confirm";
import {
  createNewCardAPI,
  deleteColumnAPI,
  updateColumnDetailsAPI,
} from "~/apis";
import { cloneDeep } from "lodash";
import {
  selectCurrentActiveBoard,
  updateCurrentActiveBoard,
} from "~/redux/activeBoard/activeBoardSlice";
import { useDispatch, useSelector } from "react-redux";
import ToggleFocusInput from "~/components/Form/ToggleFocusInput";
const Column = ({ column }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging, // làm mờ cái column kéo đi đi
  } = useSortable({ id: column._id, data: { ...column } }); //để xác định xem đang kéo cái nào

  const dndKitColumnStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    height: "100%",
    opacity: isDragging ? 0.5 : undefined, // làm mờ cái column kéo đi đi
  };

  const orderedCards = column.cards;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const dispatch = useDispatch();
  const board = useSelector(selectCurrentActiveBoard);
  const [openNewCardForm, setOpenNewCardForm] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const toggleOpenNewCardForm = () => {
    setOpenNewCardForm(!openNewCardForm);
  };
  const createNewCard = async (newCardData) => {
    const res = await createNewCardAPI({
      ...newCardData,
      boardId: board._id,
    });
    const newBoard = cloneDeep(board);
    //tim column chứa cái card vừa tạo ra
    const columnToUpdate = newBoard.columns.find((c) => c._id === res.columnId);
    if (columnToUpdate) {
      if (columnToUpdate.cards.some((card) => card.FE_placholderCard)) {
        //rông
        columnToUpdate.cards = [res];
        columnToUpdate.cardOrderIds = [res._id];
      } else {
        //có đât thì push vào
        columnToUpdate.cards.push(res);
        columnToUpdate.cardOrderIds.push(res._id);
      }
    }
    dispatch(updateCurrentActiveBoard(newBoard));
  };

  const addNewCard = async () => {
    if (!newCardTitle) {
      toast.error("Please enter card title");
      return;
    }
    const newCardData = {
      title: newCardTitle,
      columnId: column._id,
    };
    await createNewCard(newCardData);
    setOpenNewCardForm(false);
    setNewCardTitle("");
  };
  const deleteColumn = (columnId) => {
    const newBoard = cloneDeep(board);
    newBoard.columns = newBoard.columns.filter((c) => c._id !== columnId);
    newBoard.columnOrderIds = newBoard.columns.map((c) => c._id);
    dispatch(updateCurrentActiveBoard(newBoard));
    deleteColumnAPI(columnId).then((res) => {
      toast.success(res?.deleteResult);
    });
  };
  const confirmDeleteColumn = useConfirm();
  const handleDeleteColumn = () => {
    confirmDeleteColumn({
      allowClose: false,
      title: "Delete Column ?",
      description:
        "This action will permanently delete your Column and its Cards! Are you sure?",
    })
      .then(() => {
        deleteColumn(column._id);
      })
      .catch(() => {});
  };

  const onUpdateColumnTitle = (newTitle) => {
    updateColumnDetailsAPI(column._id, {
      title: newTitle.trim(),
    }).then(() => {
      const newBoard = cloneDeep(board);
      const columnToUpdate = newBoard.columns.find((c) => c._id === column._id);
      if (columnToUpdate) {
        columnToUpdate.title = newTitle.trim();
      }
      dispatch(updateCurrentActiveBoard(newBoard));
    });
  };

  return (
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
      <Box
        {...listeners}
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
            height: (theme) => theme.trello.columnHeaderHeight,
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ToggleFocusInput
            value={column?.title}
            onChangedValue={onUpdateColumnTitle}
            data-no-Dnd="true"
          />

          <Box>
            <Tooltip title="More Options">
              <ExpandMoreIcon
                id="basic-column-dropdown"
                aria-controls={open ? "basic-menu-column-dropdown" : undefined}
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
              onClick={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-column-dropdown",
              }}
            >
              <MenuItem
                onClick={toggleOpenNewCardForm}
                sx={{
                  "&:hover": {
                    color: "success.light",
                    "& .add-card-icon": {
                      color: "success.light",
                    },
                  },
                }}
              >
                <ListItemIcon>
                  <AddCardIcon className="add-card-icon" fontSize="small" />
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

              <MenuItem
                onClick={handleDeleteColumn}
                sx={{
                  "&:hover": {
                    color: "warning.dark",
                    "& .delete-forever-icon": {
                      color: "warning.dark",
                    },
                  },
                }}
              >
                <ListItemIcon>
                  <DeleteForeverIcon
                    className="delete-forever-icon"
                    fontSize="small"
                  />
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
        <ListCards cards={orderedCards} />
        {/* footer */}
        <Box
          sx={{
            height: (theme) => theme.trello.columnFooterHeight,
            p: 2,
          }}
        >
          {!openNewCardForm ? (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Button
                startIcon={<AddCardIcon />}
                onClick={toggleOpenNewCardForm}
              >
                Add new card
              </Button>
              <Tooltip title="Drag to move">
                <DragHandleIcon sx={{ cursor: "pointer" }} />
              </Tooltip>
            </Box>
          ) : (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <TextField
                data-no-Dnd="true"
                sx={{
                  "& label": { color: "text.primary" },
                  "& input": {
                    color: (theme) => theme.palette.primary.main,
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark" ? "#333643" : "white",
                  },
                  "& label.Mui-focused": {
                    color: (theme) => theme.palette.primary.main,
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: (theme) => theme.palette.primary.main,
                    },
                    "&:hover fieldset": {
                      borderColor: (theme) => theme.palette.primary.main,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: (theme) => theme.palette.primary.main,
                    },
                  },
                }}
                label="Enter card title..."
                type="text"
                size="small"
                variant="outlined"
                autoFocus
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Button
                  className="interceptor-loading"
                  data-no-Dnd="true"
                  onClick={addNewCard}
                  sx={{
                    boxShadow: "none",
                    border: "0.5px solid",
                    borderColor: (theme) => theme.palette.success.main,
                    "&:hover": {
                      bgcolor: (theme) => theme.palette.success.light,
                    },
                  }}
                  variant="contained"
                  color="success"
                  size="small"
                >
                  Add
                </Button>
                <CloseIcon
                  fontSize="small"
                  onClick={() => {
                    toggleOpenNewCardForm();
                    setNewCardTitle("");
                  }}
                  sx={{
                    color: (theme) => theme.palette.warning.light,
                    cursor: "pointer",
                  }}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default Column;
