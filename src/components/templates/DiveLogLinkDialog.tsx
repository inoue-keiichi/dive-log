import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import copy from "copy-to-clipboard";
import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";
import ClickAwayListener from "@mui/material/ClickAwayListener";

type Props = {
  open: boolean;
  link: string;
  onClose: (open: boolean) => void;
};

function DiveLogLinkDialog(props: Props) {
  const { onClose, link, open } = props;

  const [showCopied, setShowCopied] = useState<boolean>(false);

  return (
    <Dialog sx={{ p: "50px" }} onClose={() => onClose(false)} open={open}>
      <DialogTitle>バディにコメントをもらう</DialogTitle>
      <Paper
        sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 400 }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          defaultValue={link}
          inputProps={{ "aria-label": "search google maps", readOnly: true }}
        />
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <ClickAwayListener onClickAway={() => setShowCopied(false)}>
          <Tooltip
            title="コピー完了！"
            open={showCopied}
            onClose={() => setShowCopied(false)}
            placement="top"
            arrow
            disableFocusListener
            disableHoverListener
            disableTouchListener
          >
            <Button
              onClick={() => {
                copy(link);
                setShowCopied(true);
              }}
            >
              コピー
            </Button>
          </Tooltip>
        </ClickAwayListener>
      </Paper>
      <DialogActions>
        <Button onClick={() => onClose(false)}>キャンセル</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DiveLogLinkDialog;
