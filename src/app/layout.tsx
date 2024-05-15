import styles from "@/styles/Home.module.css";
import { AppBar, Toolbar, Typography } from "@mui/material";
import "../styles/globals.css";

export const metadata = {
  title: "Dive Log",
  description: "Let's log your diving memories!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              DIVING LOG BOOK
            </Typography>
          </Toolbar>
        </AppBar>
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  );
}
