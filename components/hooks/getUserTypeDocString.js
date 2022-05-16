const getUserTypeDocString = (userType) => {
  if (userType === "Shopkeeper") return "shopkeeper";
  else if (userType === "Organization") return "organization";
  else if (userType === "Individual User") return "individualUser";
};

export default getUserTypeDocString;
