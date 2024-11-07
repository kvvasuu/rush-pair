const calculateYearsSince = (dateString) => {
  const givenDate = new Date(dateString);
  const today = new Date();

  let yearsDifference = today.getFullYear() - givenDate.getFullYear();

  if (
    today.getMonth() < givenDate.getMonth() ||
    (today.getMonth() === givenDate.getMonth() &&
      today.getDate() < givenDate.getDate())
  ) {
    yearsDifference--;
  }

  return yearsDifference;
};

export default calculateYearsSince;
