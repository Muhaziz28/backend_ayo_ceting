const payload = (status, success, code, errorMessage, content, res) => {
  if (status === "OK") {
    return res.status(code).json({
      success: success,
      status: status,
      message: errorMessage,
      content: content,
    });
  }

  return res.status(code).json({
    success: success,
    status: status,
    message: errorMessage,
  });
};

export default payload;
