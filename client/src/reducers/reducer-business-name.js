const businessName = (state = null, action) => {
  switch (action.type) {
    case 'GET_BUSINESS_NAME':
      return action.payload;
    default:
      return state;
  }
};

export default businessName;
