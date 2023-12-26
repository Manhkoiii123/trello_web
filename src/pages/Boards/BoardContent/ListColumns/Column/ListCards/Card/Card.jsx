import { Card as MuiCard } from "@mui/material";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import GroupIcon from "@mui/icons-material/Group";
import CommentIcon from "@mui/icons-material/Comment";
import AttachmentIcon from "@mui/icons-material/Attachment";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const Card = ({ temporaryHideMedia }) => {
  if (temporaryHideMedia) {
    return (
      <MuiCard
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
      </MuiCard>
    );
  }
  return (
    <MuiCard
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
    </MuiCard>
  );
};

export default Card;
