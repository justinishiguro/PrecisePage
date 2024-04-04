import React from "react";
import { jwtDecode } from "jwt-decode";

function Home() {
  const [email, setEmail] = React.useState("");

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setEmail(decoded.email);
      console.log(decoded);
    }
  }, []);

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      {email && <p>Logged in as: {email}</p>}
    </div>
  );
}

export default Home;
