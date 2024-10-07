import React from "react";
import ResponsiveNabBar from "../../components/Company/ResponsiveNavBar";

const Company = ({user, userData}) => {
  return <ResponsiveNabBar user={user} userData={userData} />;
};

export default Company;
