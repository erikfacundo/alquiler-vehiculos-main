import React, { useState } from "react";

function Login({ login }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Verificar las credenciales del usuario
    const usuario = {
      email,
      password,
      isAdmin: true, // Este valor debería venir de la API si el usuario es admin
    };
    login(usuario); // Llamamos a la función login pasada como prop
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Iniciar sesión</button>
    </div>
  );
}

export default Login;
