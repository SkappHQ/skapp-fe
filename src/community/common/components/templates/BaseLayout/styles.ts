const styles = () => ({
  protectedWrapper: {
    flexDirection: "row",
    width: "100%"
  },
  contentWrapper: {
    width: "100%",
    boxSizing: "border-box",
    transition: "width 0.3s ease"
  },
  unProtectedWrapper: {
    flexDirection: "column",
    width: "100dvw",
    height: "100dvh",
    boxSizing: "border-box"
  }
});

export default styles;
