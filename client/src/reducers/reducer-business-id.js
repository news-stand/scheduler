const businessId = (state = null, action) => {
  switch (action.type) {
    case 'GET_ALL':
      return action.payload.businessId || null;
    // case 'GET_ALL':
    //   return action.payload.businessId;
    default:
      return state;
  }
};

export default businessId;
