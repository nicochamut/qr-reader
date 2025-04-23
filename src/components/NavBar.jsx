import React from "react";
import ypflogo from "../assets/ypflogo.png";
import styled from "styled-components";

const NavBar = ({ bandera }) => {
  console.log(bandera);
  return (
    <NavBarStyled>
      <h2>Hello</h2>
      <img
        src={
          bandera === "puma"
            ? pumalogo
            : bandera === "ypf"
            ? ypflogo
            : "/logos/default.png"
        }
        alt="logo"
      />
    </NavBarStyled>
  );
};

const NavBarStyled = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 3rem;
  background: green;
  img {
    width: 80px;
    max-width: 200px;
  }
`;

export default NavBar;
