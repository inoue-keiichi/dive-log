import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

// TODO: childrenの型
export default function Layout({ children }: Props) {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const user = useUser();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            DIVING LOG BOOK
          </Typography>
          {user && (
            <Button
              color="inherit"
              onClick={async () => {
                await supabaseClient.auth.signOut();
                router.replace("/");
              }}
            >
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <main>{children}</main>
    </>
  );
}
