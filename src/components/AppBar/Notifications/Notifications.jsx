import { useEffect, useState } from "react";
import moment from "moment";
import Badge from "@mui/material/Badge";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import DoneIcon from "@mui/icons-material/Done";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import { useDispatch, useSelector } from "react-redux";
import {
  addNotification,
  fetchInvitationAPI,
  selectCurrentNotifications,
  updateBoardInvitationApi,
} from "~/redux/notifications/notificationsSlice";
import { socketIoInstance } from "~/main";
import { selectCurrentUser } from "~/redux/user/userSlice";
import { useNavigate } from "react-router-dom";
const BOARD_INVITATION_STATUS = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
};

function Notifications() {
  const [newNotification, setNewNotification] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const notifications = useSelector(selectCurrentNotifications);
  const open = Boolean(anchorEl);
  const handleClickNotificationIcon = (event) => {
    setNewNotification(false);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const nav = useNavigate();

  useEffect(() => {
    const handleFetchInvitation = () => {
      dispatch(fetchInvitationAPI());
      // xử lí khi nhận sư kiện realtime
      const onReceiveInvitation = (invitation) => {
        // nếu user đang đăng nhập hiện tại là người invitee trong bản ghi invitation
        if (invitation.inviteeId === user._id) {
          //b1 thêm bản ghi invitation vào redux
          dispatch(addNotification(invitation));
          //b2 thông báo số lượng bnh thông báo realtime thì có cái nốt đỏ
          setNewNotification(true);
        }
      };
      socketIoInstance.on("invite-user-to-board-be", onReceiveInvitation);
      return () => {
        socketIoInstance.off("invite-user-to-board-be", onReceiveInvitation);
      };
    };
    handleFetchInvitation();
  }, [dispatch, user._id]);
  const updateBoardInvitation = (invitationId, status) => {
    dispatch(updateBoardInvitationApi({ status, invitationId })).then((res) => {
      if (
        res.payload.boardInvitation.status === BOARD_INVITATION_STATUS.ACCEPTED
      ) {
        nav(`/boards/${res.payload.boardInvitation.boardId}`);
      }
    });
  };

  return (
    <Box>
      <Tooltip title="Notifications">
        <Badge
          color="warning"
          variant={newNotification ? "dot" : "none"}
          sx={{ cursor: "pointer" }}
          id="basic-button-open-notification"
          aria-controls={open ? "basic-notification-drop-down" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClickNotificationIcon}
        >
          <NotificationsNoneIcon
            sx={{
              color: newNotification ? "yellow" : "white",
            }}
          />
        </Badge>
      </Tooltip>

      <Menu
        sx={{ mt: 2 }}
        id="basic-notification-drop-down"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ "aria-labelledby": "basic-button-open-notification" }}
      >
        {(!notifications || notifications.length === 0) && (
          <MenuItem sx={{ minWidth: 200 }}>
            You do not have any new notifications.
          </MenuItem>
        )}
        {notifications?.map((n, index) => (
          <Box key={index}>
            <MenuItem
              sx={{
                minWidth: 200,
                maxWidth: 360,
                overflowY: "auto",
              }}
            >
              <Box
                sx={{
                  maxWidth: "100%",
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box>
                    <GroupAddIcon fontSize="small" />
                  </Box>
                  <Box>
                    <strong>{n.inviter?.displayName}</strong> had invited you to
                    join the board <strong>{n.board?.title}</strong>
                  </Box>
                </Box>

                {n.boardInvitation.status ===
                  BOARD_INVITATION_STATUS.PENDING && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      className="interceptor-loading"
                      type="submit"
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() =>
                        updateBoardInvitation(
                          n._id,
                          BOARD_INVITATION_STATUS.ACCEPTED
                        )
                      }
                    >
                      Accept
                    </Button>
                    <Button
                      className="interceptor-loading"
                      type="submit"
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={() =>
                        updateBoardInvitation(
                          n._id,
                          BOARD_INVITATION_STATUS.REJECTED
                        )
                      }
                    >
                      Reject
                    </Button>
                  </Box>
                )}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    justifyContent: "flex-end",
                  }}
                >
                  {n.boardInvitation.status ===
                    BOARD_INVITATION_STATUS.ACCEPTED && (
                    <Chip
                      icon={<DoneIcon />}
                      label="Accepted"
                      color="success"
                      size="small"
                    />
                  )}
                  {n.boardInvitation.status ===
                    BOARD_INVITATION_STATUS.REJECTED && (
                    <Chip
                      icon={<NotInterestedIcon />}
                      label="Rejected"
                      size="small"
                    />
                  )}
                </Box>

                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="span" sx={{ fontSize: "13px" }}>
                    {moment(n.createdAt).format("llll")}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
            {index !== notifications?.length - 1 && <Divider />}
          </Box>
        ))}
      </Menu>
    </Box>
  );
}

export default Notifications;
