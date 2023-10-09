import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../firebase";
import { signInWithPopup, getAuth, getIdToken } from "firebase/auth";
import { useAuthContext } from "../context/AuthContext";

const FASTAPI_ENDPOINT = "http://localhost:8000";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const { user } = useAuthContext();

  const handleLogin = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await getIdToken(result.user);
      console.log("ID Token:", token);
      // FastAPI エンドポイントにリクエストを送信
      await sendRequestToBackend(token);
    } catch (error) {
      if (error instanceof Error) {
        // 型チェック
        console.log(error.message);
        setError(error.message);
      } else {
        // errorがErrorオブジェクトでない場合の処理（必要に応じて）
        console.log(error);
        setError("An unknown error occurred.");
      }
    }
    navigate("/");
  };

  const sendRequestToBackend = async (token: string) => {
    const apiUrl = `${FASTAPI_ENDPOINT}/users/`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ user_id: user?.uid }),
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <>
      <div className="container p-5 w-50">
        <div className="d-flex my-5">
          <div className="col-12 p-5 rounded">
            <h1 className="display-2 font-weight-bold my-5 text-center text-primary">
              SkillHub
            </h1>
            <h3 className="mb-5 mt-5 text-center">ログイン</h3>
            <div className="d-flex">
              <div className="m-auto">
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button
                  type="button"
                  className="btn btn-primary mb-5"
                  onClick={handleLogin}
                >
                  Googleログイン
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
