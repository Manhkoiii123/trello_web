import Box from "@mui/material/Box";
import Column from "./Column/Column";
import Button from "@mui/material/Button";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { createNewColumnAPI } from "~/apis";
import { generatePlaceholderCard } from "~/utils/formaters";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentActiveBoard,
  updateCurrentActiveBoard,
} from "~/redux/activeBoard/activeBoardSlice";

const ListColumns = ({ columns }) => {
  const board = useSelector(selectCurrentActiveBoard);
  const dispatch = useDispatch();
  const [openNewColumnForm, setOpenNnewColumnForm] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const toggleOpenNewColumnForm = () => {
    setOpenNnewColumnForm(!openNewColumnForm);
  };
  const addNewColumn = async () => {
    if (!newColumnTitle) {
      toast.error("Please enter column title!");
      return;
    }
    const newColumnData = {
      title: newColumnTitle,
    };
    const res = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id,
    });
    res.cards = [generatePlaceholderCard(res)];
    res.cardOrderIds = [generatePlaceholderCard(res)._id];
    //c1
    // const newBoard = cloneDeep(board);
    //c2
    const newBoard = { ...board };
    newBoard.columns = newBoard.columns.concat([res]);
    newBoard.columnOrderIds = newBoard.columnOrderIds.concat([res._id]);

    // newBoard.columns.push(res);
    // newBoard.columnOrderIds.push(res._id);
    dispatch(updateCurrentActiveBoard(newBoard));
    setOpenNnewColumnForm(false);
    setNewColumnTitle("");
  };
  return (
    <SortableContext
      items={columns?.map((c) => c._id)}
      strategy={horizontalListSortingStrategy}
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
        {columns?.map((column) => {
          return <Column key={column?._id} column={column} />;
        })}

        {!openNewColumnForm ? (
          <Box
            onClick={toggleOpenNewColumnForm}
            sx={{
              minWidth: "250px",
              maxWidth: "250px",
              mx: 2,
              borderRadius: "6px",
              height: "fit-content",
              bgcolor: "#ffffff3d",
            }}
          >
            <Button
              sx={{
                color: "white",
                width: "100%",
                justifyContent: "flex-start",
                pl: 2.5,
                py: 1,
              }}
              startIcon={<NoteAddIcon />}
            >
              Add new column
            </Button>
          </Box>
        ) : (
          //add new
          <Box
            sx={{
              minWidth: "250px",
              maxWidth: "250px",
              mx: 2,
              p: 1,
              borderRadius: "6px",
              bgcolor: "#ffffff3d",
              height: "fit-content",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <TextField
              sx={{
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
              label="Enter column title..."
              type="text"
              size="small"
              variant="outlined"
              autoFocus
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
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
                onClick={addNewColumn}
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
                Add column
              </Button>
              <CloseIcon
                fontSize="small"
                onClick={() => {
                  setOpenNnewColumnForm(false);
                  setNewColumnTitle("");
                }}
                sx={{
                  color: "white",
                  cursor: "pointer",
                  "&:hover": {
                    color: (theme) => theme.palette.warning.light,
                  },
                }}
              />
            </Box>
          </Box>
        )}
      </Box>
    </SortableContext>
  );
};

export default ListColumns;
