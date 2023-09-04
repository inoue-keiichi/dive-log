import { DialogContent, Stack, Typography, useMediaQuery } from "@mui/material";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Tooltip from "@mui/material/Tooltip";
import copy from "copy-to-clipboard";
import { useState } from "react";

type Props = {
  open: boolean;
  link: string;
  onClose: (open: boolean) => void;
  children?: React.ReactNode;
};

function DiveLogLinkDialog(props: Props) {
  const { onClose, link, open } = props;

  const media = useMediaQuery("(max-width:768px)");
  const [showCopied, setShowCopied] = useState<boolean>(false);

  return (
    <Dialog fullScreen={media} onClose={() => onClose(false)} open={open}>
      <DialogTitle>バディにコメントをもらう</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
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
                variant="contained"
                color="inherit"
                onClick={() => {
                  copy(link);
                  setShowCopied(true);
                }}
              >
                コメントページのリンクをコピー
              </Button>
            </Tooltip>
          </ClickAwayListener>
          {/* <Paper
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: 350,
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              defaultValue={link}
              inputProps={{ "aria-label": "copy-path", readOnly: true }}
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
          </Paper> */}
          <Typography>SNSで共有する</Typography>
          {props.children}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)}>キャンセル</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DiveLogLinkDialog;
