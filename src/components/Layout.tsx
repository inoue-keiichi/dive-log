import { supabaseClient } from "@/clients/supabase";
import { AppBar, Link, Toolbar, Typography } from "@mui/material";
import { Session } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";

type Props = {
  children: ReactNode;
};

// TODO: childrenの型
export default function Layout({ children }: Props) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    (async () => {
      const res = await supabaseClient.auth.getSession();
      res.data.session;
      setSession(res.data.session);
    })();
  }, []);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            DIVING LOG BOOK
          </Typography>
          {session && (
            <form action="/auth/signout" method="post">
              <Link component="button" color="inherit" variant="body1">
                Sign out
              </Link>
            </form>
          )}
        </Toolbar>
      </AppBar>
      <main>{children}</main>
    </>
  );
}
