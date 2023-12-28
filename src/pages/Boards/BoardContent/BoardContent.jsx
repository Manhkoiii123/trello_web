import Box from "@mui/material/Box";
import ListColumns from "./ListColumns/ListColumns";
import { mapOrder } from "~/utils/sort";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
const BoardContent = ({ board }) => {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10, //yêu cầu con chuột move 10px trước khi avtive
    },
  });
  const touchSenser = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250, //nhấn giữ khoảng 250ms
      tolerance: 5, // dung sai của cảm ứng(di chuyển và chênh lệch 5px mới kihs hoạt event)
    },
  });
  // const sensors = useSensors(pointerSenser);
  const sensors = useSensors(mouseSensor, touchSenser);

  const [orderedColumnState, setOrderedColumnState] = useState([]);
  useEffect(() => {
    const orderedColumn = mapOrder(
      board?.columns,
      board?.columnOrderIds,
      "_id"
    );
    setOrderedColumnState(orderedColumn);
  }, [board?.columnOrderIds, board?.columns]);
  const handleDragEnd = (event) => {
    // console.log(event);
    const { active, over } = event;
    //vị trí nó có thay đổi ko
    if (!over) return;
    if (active.id !== over.id) {
      //vị trí cũ từ thằng active
      const oldIndex = orderedColumnState.findIndex((c) => c._id === active.id);
      //vị trí mỡi của thằng đó từ over
      const newIndex = orderedColumnState.findIndex((c) => c._id === over.id);
      //mảng sau kéo thả
      const dndOrderedColumn = arrayMove(
        orderedColumnState,
        oldIndex,
        newIndex
      );
      // mảng id sau khi kéo
      //để sau gọi api để cập nhật lại cái này vào dữ liệu
      //nếu ko có thì f5 lại thì lại về cái ban đầu
      // const dndOrderedColumnIds = dndOrderedColumn.map((c) => c._id);

      setOrderedColumnState(dndOrderedColumn);
    }
  };
  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <Box
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#34495e" : "#1976d2",
          width: "100%",
          height: (theme) => theme.trello.boardContentHeight,
          p: "10px 0",
        }}
      >
        <ListColumns columns={orderedColumnState} />
      </Box>
    </DndContext>
  );
};

export default BoardContent;
