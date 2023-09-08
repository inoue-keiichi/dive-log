import styles from "@/styles/Home.module.css";
import { CircularProgress } from "@mui/material";

const Loading = () => {
  return (
    <div className={styles.loading}>
      <CircularProgress size={60} thickness={6} />
    </div>
  );
};

export default Loading;
