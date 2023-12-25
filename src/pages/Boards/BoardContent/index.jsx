import Box from "@mui/material/Box";
const BoardContent = () => {
  return (
    <Box
      sx={{
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#34495e" : "#1976d2",
        width: "100%",
        display: "flex",
        height: (theme) =>
          `calc(100vh - ${theme.trello.appBarHeight} - ${theme.trello.boardBarHeight})`,
        alignItems: "center",
      }}
    >
      Box content
    </Box>
  );
};

export default BoardContent;
