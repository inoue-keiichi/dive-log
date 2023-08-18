import { BuddyComment as BC } from "@/schemas/buudy";
import List from "@mui/material/List";
import { Divider, ListItem, ListItemText } from "@mui/material";

type BuddyComment = BC & {
  id: number;
  createdAt: Date;
};

type Props = {
  buddyComments: BuddyComment[];
};

function BuddyCommentList(props: Props) {
  const { buddyComments } = props;

  return (
    <List sx={{ width: "50%", bgcolor: "background.paper", borderRadius: 2 }}>
      {buddyComments.map((comment, index) => (
        <>
          <ListItem key={comment.id} alignItems="flex-start">
            <ListItemText
              primary={comment.text}
              secondary={comment.name + " / " + comment.createdAt}
            />
          </ListItem>
          {/* コメントの間にだけDividerが欲しい */}
          {index < buddyComments.length - 1 && <Divider />}
        </>
      ))}
    </List>
  );
}

export default BuddyCommentList;
