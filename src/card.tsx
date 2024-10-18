const styles = {
  card: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "16px",
    paddingTop: "5px",
    marginBottom: "5px",
    maxWidth: "300px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  title: {
    margin: "0 0 8px 0",
    fontSize: "1.0em", // 调整字体大小
    textAlign: "left", // 左对齐
    width: "70px",
  },
  content: {
    margin: 0,
    fontSize: "1em",
    color: "#555",
  },
} as any;
const Card = ({
  title,
  content,
  pathPrefix,
}: {
  title: string;
  content: string;
  pathPrefix: string;
}) => {
  return (
    <div style={styles.card}>
      {title && content && (
        <>
          <h2 style={styles.title}>{title}</h2>
          <p style={styles.content}>{content}</p>
        </>
      )}
    </div>
  );
};

export default Card;
