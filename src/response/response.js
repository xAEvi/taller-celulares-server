export const response_created = (p_id, p_message) => {
  return {
    success: true,
    status_code: 201,
    message: p_message,
    record_id: p_id,
  };
};

export const response_success = (p_id, p_message) => {
  return {
    success: true,
    status_code: 200,
    message: p_message,
    data: p_id,
  };
};

export const response_error = (p_code, p_message) => {
  return {
    success: false,
    status_code: p_code,
    message: p_message,
  };
};

export const response_not_found = (p_message) => {
  return {
    success: false,
    status_code: 404,
    message: p_message,
  };
};

export const response_bad_request = (p_code, p_message) => {
  return {
    success: false,
    status_code: 400,
    message: p_message,
  };
};
