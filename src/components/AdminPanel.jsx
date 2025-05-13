import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  padding: 2rem;
  background: linear-gradient(45deg, #616161, #3d3d3d);
  min-height: 100vh;
  color: white;
`;

const Title = styled.h1`
  font-weight: 600;
  font-size: 2.7rem;
  margin-bottom: 3rem;
  text-align: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
`;

const NavButton = styled.button`
  background-color: #2563eb;
  color: white;
  font-size: 1.2rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: background 0.3s ease;

  &:hover {
    background-color: #1d4ed8;
  }
`;

const AdminPanel = () => {
  const { estacion } = useParams();
  const navigate = useNavigate();

  return (
    <Container>
      <Title>Panel Administrativo - {estacion}</Title>
      <ButtonGroup>
        <NavButton onClick={() => navigate(`/admin/${estacion}/qrs`)}>
          QRs
        </NavButton>
        <NavButton onClick={() => navigate(`/admin/${estacion}/listas`)}>
          Listas
        </NavButton>
      </ButtonGroup>
    </Container>
  );
};

export default AdminPanel;
