export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      <div style={styles.grid}>
        <div style={styles.card}>Users: 120</div>
        <div style={styles.card}>Sales: $4500</div>
        <div style={styles.card}>Orders: 320</div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "15px",
    marginTop: "20px",
  },
  card: {
    padding: "20px",
    background: "#f3f4f6",
    borderRadius: "10px",
  },
};