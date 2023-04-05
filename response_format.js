const payload = (code, success, message, data, res) => {
  if (success === true) {
    return res.status(code).json({
      meta: {
        code: code,
        success: success,
        message: message,
      },
      data: data,
    });
  }

  return res.status(code).json({
    meta: {
      code: code,
      success: success,
      message: message,
    },
  });
}

export default payload;