import styled from "styled-components";

// Styled components
export const Container = styled.div`
  padding: 2rem;
  background: linear-gradient(45deg, #616161, #3d3d3d);
  min-height: 100vh;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .product-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    min-height: 30rem;
  }
`;

export const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

export const SearchInput = styled.input`
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: #ffffff;
  background-color: #2c2c2c;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.813);
  outline: none;
  transition: all 0.3s ease;
  width: 40rem;
  margin-bottom: 2rem;

  &&::placeholder {
    color: #aaaaaa;
  }
`;

export const Button = styled.button`
  background: ${({ color }) => color || "#2563eb"};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-right: 0.5rem;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const DangerButton = styled(Button)`
  background: #f87171;
`;

export const ProductListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 25px;
  justify-content: start;
`;

export const ProductCard = styled.div`
  background: white;
  color: black;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  height: 2rem;
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`;

export const ListOptions = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 2rem;
  background: rgb(34, 34, 34);
  margin-top: 2rem;
  width: 70%;
`;

export const ListContainerBase = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  border: 1px solid rgb(151, 151, 151);

  min-height: 42rem;
  width: 50%;

  ul {
    display: flex;
    justify-content: space-between;
    align-items: center;

    flex-direction: column;
    padding: 0;

    width: 100%;
  }

  li {
    list-style: none;
    margin: 0.2rem 0;
    padding: 0.5rem;
    background: linear-gradient(45deg, #616161, #3d3d3d);
    color: white;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 1rem;
    min-width: 35rem;
  }
`;

export const ListEdit = styled(ListContainerBase)``;
export const ListView = styled(ListContainerBase)``;
