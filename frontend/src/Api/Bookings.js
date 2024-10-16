export const getBookingsForDate = async (date) => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/booking/getByDate?date=${date}`);
    const data = await response.json();
    return data; // This should return all bookings for a given date
  };
  