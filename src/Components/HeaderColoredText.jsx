function HeaderColoredText(props) {
  return (
    <div className="d-flex flex-row flex-wrap justify-content-evenly align-items-center">
      <p
        className="text-center fs-1 fw-bold display-3 m-3"
        style={{
          background: "linear-gradient(90deg, #007bff, #6610f2)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {props.text}
      </p>
    </div>
  );
}
export default HeaderColoredText;
