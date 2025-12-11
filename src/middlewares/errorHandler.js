module.exports = (err, req, res, next) => {
  console.error("ERROR:", err);

  // If error has an explicit status code (e.g., from validation or service)
  if (err.status) {
    return res.status(err.status).json({
      error: err.message || "Something went wrong"
    });
  }

  // Fallback for unexpected server errors
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development"
      ? err.message
      : "Something went wrong"
  });
};
