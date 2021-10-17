import { useState } from "react";
import SignIn from "./Signin";
import Signup from "./Signup";

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  return (
    <section>
      {isLogin ? (
        <SignIn login={switchAuthModeHandler} />
      ) : (
        <Signup login={switchAuthModeHandler} />
      )}
    </section>
  );
}

export default AuthForm;
