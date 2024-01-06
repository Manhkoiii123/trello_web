/* eslint-disable no-extra-boolean-cast */
import Box from "@mui/material/Box";
import { cloneDeep, isEmpty } from "lodash";
import ListColumns from "./ListColumns/ListColumns";
import {
  DndContext,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  getFirstCollision,
} from "@dnd-kit/core";
import { MouseSensor, TouchSensor } from "~/customLibs/DndkitSensor";
import { useCallback, useEffect, useRef, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import Column from "./ListColumns/Column/Column";
import Card from "./ListColumns/Column/ListCards/Card/Card";
import { generatePlaceholderCard } from "~/utils/formaters";

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: "ACTIVE_DRAG_ITEM_TYPE_COLUMN",
  CARD: "ACTIVE_DRAG_ITEM_TYPE_CARD",
};

const BoardContent = ({
  deleteColumn,
  moveCardDifferentColumn,
  moveCardInSameColumn,
  moveColumn,
  createNewCard,
  createNewColumn,
  board,
}) => {
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
  // cùng 1 thời điểm chỉ có 1 phần tử được kéo lưu lại các cái cần thiết
  const [activeDragItemId, setActiveDragItemId] = useState(null);
  const [activeDragItemType, setActiveDragItemType] = useState(null);
  const [activeDragItemData, setActiveDragItemData] = useState(null);

  useEffect(() => {
    setOrderedColumnState(board.columns);
  }, [board]);

  //set lại cái state cho cột,card để hiển thị

  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData,
    triggerFrom
  ) => {
    //cập nhật lại state khi move card khác cột
    setOrderedColumnState((prev) => {
      const overCardIndex = overColumn?.cards?.findIndex(
        (card) => card._id === overCardId
      );
      let newCardIndex;
      const isBelowOverItem =
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height;
      const modifier = isBelowOverItem ? 1 : 0;

      newCardIndex =
        overCardIndex >= 0
          ? overCardIndex + modifier
          : overColumn?.cards?.length + 1;

      const nextColumns = cloneDeep(prev);
      const nextActiveColumn = nextColumns.find(
        (column) => column._id === activeColumn._id
      );
      const nextOverColumn = nextColumns.find(
        (column) => column._id === overColumn._id
      );
      if (nextActiveColumn) {
        nextActiveColumn.cards = nextActiveColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        );
        //thêm cái card rỗng nếu như cái active column ko còn phần tử để fix cái bug 37.2
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)];
        }
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
          (card) => card._id
        );
      }
      if (nextOverColumn) {
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        );
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id,
        };
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex,
          0,
          rebuild_activeDraggingCardData
        );
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (c) => !c.FE_PlaceholderCard
        );
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
          (card) => card._id
        );
      }
      if (triggerFrom === "handleDragEnd") {
        //gọi api update ở đây
        moveCardDifferentColumn(
          activeDraggingCardId,
          oldColumnWhenDraggingCard._id,
          nextOverColumn._id,
          nextColumns
        );
      }
      return nextColumns;
    });
  };

  //tạo state quản lsi cái column cũ
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] =
    useState(null);
  const handleDragStart = (e) => {
    setActiveDragItemId(e?.active?.id);
    setActiveDragItemType(
      e?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    );
    setActiveDragItemData(e?.active?.data?.current);
    // nếu kéo card thì mới set
    if (e?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(e?.active?.id));
    }
  };

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  //quá trình kéo 1 phần tử
  const findColumnByCardId = (cardId) => {
    return orderedColumnState.find((column) =>
      column?.cards?.map((card) => card?._id)?.includes(cardId)
    );
  };
  const handleDragOver = (e) => {
    // console.log("handle drag over", e);
    //ko lmaf gì nếu kéo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return;
    }

    //Card => xử lí thêm để kéo thả giữa các column
    const { active, over } = e;
    if (!over || !active) return;
    //card đang kéo
    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData },
    } = active;
    //cái card đang được di vòa vị trí mới
    const { id: overCardId } = over;

    //tìm 2 cái column chứa cái 2 id ở trên
    const activeColumn = findColumnByCardId(activeDraggingCardId);
    const overColumn = findColumnByCardId(overCardId);
    if (!activeColumn || !overColumn) return;
    // kéo sang cột khác mới chạy cái này
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData,
        "handleDragOver"
      );
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    //vị trí nó có thay đổi ko
    if (!over) return;
    //card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      //lấy tương tự như over
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData },
      } = active;
      const { id: overCardId } = over;
      const activeColumn = findColumnByCardId(activeDraggingCardId);
      const overColumn = findColumnByCardId(overCardId);
      if (!activeColumn || !overColumn) return;
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        //kéo sang cột khác
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData,
          "handleDragEnd"
        );
      } else {
        //kéo cùng cột
        //lấy vị trí cũ từ oldColumnWhenDraggingCard
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(
          (c) => c._id === activeDragItemId //activeDragItemId là cái được kéo set lúc start
        );
        //vị trí mới từ over
        const newCardIndex = overColumn?.cards?.findIndex(
          (c) => c._id === overCardId //thực chất nó vẫn là over.id
        );
        const dndOrderedCard = arrayMove(
          oldColumnWhenDraggingCard?.cards,
          oldCardIndex,
          newCardIndex
        );
        const dndOrderedCardIds = dndOrderedCard.map((i) => i._id);
        // cập nhật tt cái dragover
        setOrderedColumnState((prev) => {
          const nextColumns = cloneDeep(prev);
          //tìm cái column đang thả (chính là cái column đấy luôn)
          const targetColumn = nextColumns.find(
            (c) => c._id === overColumn._id
          );
          targetColumn.cards = dndOrderedCard;
          targetColumn.cardOrderIds = dndOrderedCardIds;
          return nextColumns;
        });
        moveCardInSameColumn(
          dndOrderedCard,
          dndOrderedCardIds,
          oldColumnWhenDraggingCard._id // là cái column được kéo
        );
      }
    }

    //column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        //vị trí cũ từ thằng active
        const oldColumnIndex = orderedColumnState.findIndex(
          (c) => c._id === active.id
        );
        //vị trí mỡi của thằng đó từ over
        const newColumnIndex = orderedColumnState.findIndex(
          (c) => c._id === over.id
        );
        //mảng sau kéo thả
        const dndOrderedColumn = arrayMove(
          orderedColumnState,
          oldColumnIndex,
          newColumnIndex
        );
        setOrderedColumnState(dndOrderedColumn);
        moveColumn(dndOrderedColumn);
      }
    }
    setActiveDragItemData(null);
    setActiveDragItemId(null);
    setActiveDragItemType(null);
    setOldColumnWhenDraggingCard(null);
  };
  //điểm va chạm cuối cùng
  const lastOverId = useRef(null);
  const collisionDetectionStrategy = useCallback(
    (args) => {
      //nếu kéo column thì dùng cái cũ
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args });
      }
      //tìm các điểm va chạm với con trỏ
      const pointerIntersections = pointerWithin(args);
      if (!pointerIntersections?.length) return;
      //pointerIntersections.length > 0 ===!!pointerIntersections?.length;

      // thuật toán phát hiện va chạm sẽ trả về 1 array các va chạm ở đây
      // const intersections = !!pointerIntersections?.length
      //   ? pointerIntersections
      //   : rectIntersection(args);
      //tìm overID đầu tiên trong pointerIntersections ở trên
      let overId = getFirstCollision(pointerIntersections, "id"); //tham ssố thứ 2 là cái cần lấy ra
      if (overId) {
        //khi kéo sang và chạm sang column khác chưa chạm vào cái card
        // giờ làm sao để bỏ qua cái column này => là fix được
        //nếu cái over là column thì tìm tới cái cardId gần nhất bên trong khu vực va chạm đó
        //dựa vào tt closestCorners => mượt
        const checkColumn = orderedColumnState.find(
          (column) => column._id === overId
        );
        if (checkColumn) {
          overId = closestCorners({
            ...args,
            //github vis dụ
            droppableContainers: args.droppableContainers.filter(
              (container) =>
                container.id !== overId &&
                checkColumn?.cardOrderIds?.includes(container.id)
            ),
          })[0]?.id;
        }
        lastOverId.current = overId;
        return [{ id: overId }];
      }
      //nếu overId là null thì trả về []
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeDragItemType, orderedColumnState]
  );
  return (
    <DndContext
      sensors={sensors}
      // collisionDetection={closestCorners}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#34495e" : "#1976d2",
          width: "100%",
          height: (theme) => theme.trello.boardContentHeight,
          p: "10px 0",
        }}
      >
        <ListColumns
          deleteColumn={deleteColumn}
          createNewCard={createNewCard}
          createNewColumn={createNewColumn}
          columns={orderedColumnState}
        />
        <DragOverlay dropAnimation={dropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
            <Column column={activeDragItemData} />
          )}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && (
            <Card card={activeDragItemData} />
          )}
        </DragOverlay>
      </Box>
    </DndContext>
  );
};

export default BoardContent;
