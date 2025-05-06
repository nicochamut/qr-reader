import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import styled from "styled-components";
import { getDoc, doc } from "firebase/firestore";
import oleumlogo from "../assets/oleumlogo.png";

const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(45deg, #0b0b0b, #3d3d3d);
  .company {
    position: absolute;
    bottom: 2rem;
    left: 4rem;

    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    font-size: 0.8rem;
    font-family: "montserrat", sans-serif;
    color: #919191;
    img {
      width: 4rem;
    }
  }
`;

const Card = styled.div`
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 30rem;
  height: 18rem;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: linear-gradient(to left, #3d687e, #00324d);
  form {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    width: 100%;
  }
`;

const Title = styled.h1`
  font-size: 2.3rem;
  font-weight: 600;
  margin-bottom: 2rem;
  padding-bottom: -20px;
  color: white;
  width: 15rem;
  text-align: center;
  height: 3.5rem;
  border-bottom: 1px solid #ffffff33;
`;

const Input = styled.input`
  width: 80%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #5e5c5c;
  border-radius: 1rem;
  font-size: 1.2rem;

  color: #000000;
  border-radius: 8px;
`;

const Button = styled.button`
  width: 80%;
  padding: 0.75rem;
  background-color: #3bb2f6;
  color: white;
  border: none;
  border-radius: 0.25rem;
  font-size: 1.2rem;
  cursor: pointer;
  margin-top: 0.5rem;
  padding-bottom: 0.5rem;
  margin-bottom: 0.5rem;
  &&:hover {
    background: #2495d3;
  }
`;

const Error = styled.p`
  color: red;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      console.log("Iniciando login...");
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      const docRef = doc(db, "usuarios", uid);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        const estacion = data.estacion;
        if (estacion) {
          navigate(`/admin/${estacion}`);
        } else {
          console.warn("El documento no contiene el campo 'estacion'");
          setError("El documento no contiene la estación.");
        }
      } else {
        console.warn("No se encontró el documento del usuario en Firestore.");
        setError("No se encontró estación asociada al usuario.");
      }
    } catch (err) {
      console.error("Error en login:", err);
      setError(err.message || "Error inesperado.");
    }
  };

  return (
    <Container>
      <div className="company">
        <img src={oleumlogo} />
        <h3>Grupo Oleum SRL</h3>
      </div>

      <Card>
        <Title>Ingresar </Title>

        {error && <Error>{error}</Error>}
        <form onSubmit={handleLogin}>
          <Input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit">Entrar</Button>
        </form>
      </Card>
    </Container>
  );
};

export default Login;
