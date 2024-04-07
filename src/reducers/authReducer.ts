const SAVE_SIGNUP_DETAILS = "SAVE_SIGNUP_DETAILS";
const SAVE_LOGIN_DETAILS = "SAVE_LOGIN_DETAILS";
const LOGIN_BY_LOCAL_STORAGE = "LOGIN_BY_LOCAL_STORAGE";
const LOG_OUT_HANDLER = "LOG_OUT_HANDLER";
const SAVE_USER_DETAILS_FROM_SERVER = "SAVE_USER_DETAILS_FROM_SERVER";
const CHANGE_USERNAME_AND_EMAIL = "CHANGE_USERNAME_AND_EMAIL";

export function authDispatchFunction(state, { type, payload }) {
  switch (type) {
    case SAVE_USER_DETAILS_FROM_SERVER:
      return { ...state, email: payload.email, username: payload.username };

    case SAVE_SIGNUP_DETAILS:
      localStorage.setItem(
        "Login",
        JSON.stringify({ isUserLoggedIn: true, token: payload.token }),
      );
      return {
        ...state,
        isUserLoggedIn: true,
        token: payload.token,
        username: payload.user.username,
        email: payload.user.email,
      };

    case SAVE_LOGIN_DETAILS:
      const user = {
        isUserLoggedIn: true,
        token: payload.token,
        username: payload.username,
        email: payload.email,
        userId: payload.id,
      };
      localStorage.setItem("Login", JSON.stringify(user));
      return {
        ...state,
        ...user,
      };

    case LOGIN_BY_LOCAL_STORAGE:
      return {
        ...state,
        isUserLoggedIn: true,
        token: payload.user.token,
        username: payload.user.username,
        email: payload.user.email,
        userId: payload.user.userId,
      };

    case LOG_OUT_HANDLER:
      localStorage.removeItem("Login");
      return {
        ...state,
        currentUserId: null,
        isUserLoggedIn: false,
        username: "",
        email: "",
      };

    case CHANGE_USERNAME_AND_EMAIL:
      return { ...state, username: payload.username, email: payload.email };

    default:
      return state;
  }
}

export const initialAuthState = {
  isUserLoggedIn: false,
  token: "",
  username: "",
  email: "",
};
