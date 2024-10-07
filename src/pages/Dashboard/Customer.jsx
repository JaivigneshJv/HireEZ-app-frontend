import React from "react";
import ResponsiveNabBar from "../../components/Customer/ResponsiveNavBar";

const Customer = ({user, userData}) => {
  return <ResponsiveNabBar user={user} userData={userData} />;
};

export default Customer;
