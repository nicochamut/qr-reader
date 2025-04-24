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
    bottom: 6rem;
    left: 10rem;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    font-size: 2rem;
    font-family: "Montserrat";
    color: white;
    img {
      width: 15rem;
    }
  }
`;

const Card = styled.div`
  background: white;

  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 30rem;
  height: 22rem;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  margin-bottom: 2rem;
  padding-bottom: -20px;

  width: 15rem;
  text-align: center;
  height: 3.5rem;
  border-bottom: 1px solid #ffffff33;
`;

const Input = styled.input`
  width: 90%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  font-size: 1.5rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #2c9cd7;
  color: white;
  border: none;
  border-radius: 0.25rem;
  font-size: 1.2rem;
  cursor: pointer;
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
      console.log("Login correcto. UID:", uid);

      const docRef = doc(db, "usuarios", uid);
      console.log("Buscando documento en Firestore con ID:", uid);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Documento Firestore encontrado:", data);

        const estacion = data.estacion;
        if (estacion) {
          console.log("Estación encontrada:", estacion);
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
