/* =========================================================
   AUTH — simulated for prototype.
   Replace body of each function with a fetch() call to:
     POST /api/auth/login
     POST /api/auth/register
     POST /api/auth/logout
     GET  /api/auth/me
   ========================================================= */

function loginUser(email, password){
  // TODO backend: POST /api/auth/login { email, password }
  localStorage.setItem("ic_session", JSON.stringify({ email, loggedInAt: Date.now() }));
  return { ok: true, user: IC_CURRENT_USER };
}

function logoutUser(){
  // TODO backend: POST /api/auth/logout
  localStorage.removeItem("ic_session");
}

function getUser(){
  // TODO backend: GET /api/auth/me
  return IC_CURRENT_USER;
}

function isLoggedIn(){
  return !!localStorage.getItem("ic_session");
}
