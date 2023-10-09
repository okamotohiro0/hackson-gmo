import { Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

interface SessionSuggestionPost {
  technology: string;
  likes: number;
  date: Date;
}

function Header() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  // ログアウト用の関数
  const handleLogout = () => {
    auth.signOut();
    navigate("/login");
  };

  return (
    <header>
      <div className="d-flex px-3 py-1 border-bottom border-dark">
        <Link to="/" className="text-decoration-none my-auto">
          <h1 className="my-0">SkillHub</h1>
        </Link>
        <div className="ml-auto my-auto">
          {user ? (
            <>
              <button
                type="button"
                className="mr-4 btn btn-primary"
                onClick={handleLogout}
              >
                ログアウト
              </button>
            </>
          ) : null}
          {
            user &&
            <Link to={"/profile/" + user?.uid}>
              <img
                className="border border-dark rounded-circle"
                src={user?.photoURL || "http://localhost:3000/logo192.png"}
                width={50}
              />
            </Link>
          }
        </div>
      </div>
    </header>
  );
}

export default Header;
