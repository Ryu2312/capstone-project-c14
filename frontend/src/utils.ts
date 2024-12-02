export async function login(email: string, password:string) {
    const options = {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch('/login', options);
    
    if (response.ok) {
      const { token } = await response.json();
      localStorage.setItem("token", token);
    } else {
      const body = await response.json();
      const error =
        body.errors instanceof Array ? body.errors.join(", ") : body.errors;
      return Promise.reject(new Error(error));
    }
  }