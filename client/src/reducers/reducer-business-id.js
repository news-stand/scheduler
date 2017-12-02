const businessId = (state = null, action) => {
  switch (action.type) {
    case 'GET_ALL':
      console.log('---------------------------- businessID action: ', action.payload);
      return action.payload.data.businessId || null;
    // case 'GET_ALL':
    //   return action.payload.businessId;
    default:
      return state;
  }
};

export default businessId;
